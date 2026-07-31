import { processAnalysisJob } from '../services/analysis.service';
import prisma from '../config/prisma';
import { extractConcepts } from '../services/gemini.service';

// Mock Prisma client — $transaction chạy callback với cùng mock client, mô phỏng
// đúng interactive transaction API của Prisma (giống pattern trong retry-plan.test.ts).
jest.mock('../config/prisma', () => {
  const client = {
    analysisJob: {
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    concept: { create: jest.fn() },
    conceptEdge: { create: jest.fn() },
    document: { findFirst: jest.fn().mockResolvedValue(null) },
    conceptSourceRef: { createMany: jest.fn() },
    studyPlan: { update: jest.fn() },
    $transaction: jest.fn(),
  };
  client.$transaction.mockImplementation((fn: (tx: typeof client) => Promise<unknown>) =>
    fn(client)
  );
  return { __esModule: true, default: client };
});

// analysis.service cũng import 2 module này — mock để load được module mà không
// đụng Gemini/fs thật. USE_MOCK_AI=true (set bên dưới) đã bypass cả hai rồi.
jest.mock('../services/gemini.service', () => ({
  extractConcepts: jest.fn(),
  uploadFile: jest.fn(),
}));
jest.mock('../services/graph.service', () => ({
  validateDAG: jest.fn().mockResolvedValue(undefined),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedExtractConcepts = extractConcepts as jest.Mock;

const JOB_ID = 'job-uuid';
const PLAN_ID = 'plan-uuid';
const pendingJob = { id: JOB_ID, fileKey: 'notes.txt', planDraftId: PLAN_ID };

describe('processAnalysisJob', () => {
  const originalUseMockAi = process.env.USE_MOCK_AI;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.USE_MOCK_AI = 'true'; // callAi trả thẳng MOCK_EXTRACT_RESULT, không gọi Gemini thật
    (mockedPrisma.$transaction as jest.Mock).mockImplementation(
      (fn: (tx: typeof mockedPrisma) => Promise<unknown>) => fn(mockedPrisma)
    );
    (mockedPrisma.document.findFirst as jest.Mock).mockResolvedValue(null);
    (mockedPrisma.conceptSourceRef.createMany as jest.Mock).mockResolvedValue({ count: 0 });
    (mockedPrisma.concept.create as jest.Mock).mockImplementation(
      ({ data }: { data: { name: string } }) =>
        Promise.resolve({ id: `concept-${data.name}`, ...data })
    );
    (mockedPrisma.conceptEdge.create as jest.Mock).mockResolvedValue({});
    (mockedPrisma.studyPlan.update as jest.Mock).mockResolvedValue({});
  });

  afterAll(() => {
    process.env.USE_MOCK_AI = originalUseMockAi;
  });

  // --- AC 2 / AC 4: nhánh claim thất bại ---
  it('bails without touching the AI or a transaction when the atomic claim fails', async () => {
    (mockedPrisma.analysisJob.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    await processAnalysisJob(JOB_ID);

    expect(mockedPrisma.analysisJob.updateMany).toHaveBeenCalledWith({
      where: { id: JOB_ID, status: 'pending' },
      data: { status: 'processing' },
    });
    expect(mockedPrisma.analysisJob.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(mockedExtractConcepts).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
    expect(mockedPrisma.analysisJob.update).not.toHaveBeenCalled(); // markFailed cũng không bị gọi
  });

  // --- AC 2: gọi 2 lần trên cùng jobId chỉ xử lý 1 lần ---
  it('only runs the pipeline once when called twice concurrently on the same jobId', async () => {
    (mockedPrisma.analysisJob.updateMany as jest.Mock)
      .mockResolvedValueOnce({ count: 1 }) // lần gọi đầu claim thành công
      .mockResolvedValueOnce({ count: 0 }) // lần gọi thứ hai thấy job đã bị claim mất
      .mockResolvedValue({ count: 1 }); // bước finalize bên trong transaction của lần thắng
    (mockedPrisma.analysisJob.findUniqueOrThrow as jest.Mock).mockResolvedValue(pendingJob);

    await Promise.all([processAnalysisJob(JOB_ID), processAnalysisJob(JOB_ID)]);

    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockedExtractConcepts).not.toHaveBeenCalled(); // USE_MOCK_AI đã bypass, nhưng dù sao cũng không được gọi 2 lần
  });

  // --- Regression: claim thành công vẫn xử lý bình thường như trước ---
  it('claims a pending job and processes it end-to-end', async () => {
    (mockedPrisma.analysisJob.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (mockedPrisma.analysisJob.findUniqueOrThrow as jest.Mock).mockResolvedValue(pendingJob);

    await processAnalysisJob(JOB_ID);

    expect(mockedPrisma.studyPlan.update).toHaveBeenCalledWith({
      where: { id: PLAN_ID },
      data: expect.objectContaining({ status: 'active' }),
    });
    // Lần gọi updateMany thứ 2 là guard finalize (lần đầu là claim ban đầu).
    expect(mockedPrisma.analysisJob.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: JOB_ID, status: 'processing' },
      data: { status: 'done', completedAt: expect.any(Date) },
    });
    expect(mockedPrisma.analysisJob.update).not.toHaveBeenCalled(); // markFailed không bị gọi
  });

  // --- Guard cuối transaction: job bị lấy mất trạng thái 'processing' giữa chừng ---
  it('aborts the commit and marks the job failed when the finalize guard no longer sees it processing', async () => {
    (mockedPrisma.analysisJob.updateMany as jest.Mock)
      .mockResolvedValueOnce({ count: 1 }) // claim ban đầu thành công
      .mockResolvedValueOnce({ count: 0 }); // guard finalize: job đã bị "cướp" mất trạng thái processing
    (mockedPrisma.analysisJob.findUniqueOrThrow as jest.Mock).mockResolvedValue(pendingJob);

    await processAnalysisJob(JOB_ID);

    expect(mockedPrisma.analysisJob.update).toHaveBeenCalledWith({
      where: { id: JOB_ID },
      data: { status: 'failed', completedAt: expect.any(Date), retryCount: 2 },
    });
  });
});
