import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/utils/test-utils';
import { SessionDetailPanel } from './SessionDetailPanel';
import { interviewApi } from '@/features/interview/api/interview.api';
import type {
  GetInterviewResponse,
  InterviewSessionStatus,
  SessionSummaryResponse,
} from '@/features/interview/types/interview.types';
import type { InterviewSessionListItem } from '../types/history.types';

vi.mock('@/features/interview/api/interview.api', () => ({
  interviewApi: {
    getInterview: vi.fn(),
    getSummary: vi.fn(),
    resumeInterview: vi.fn(),
    abandonInterview: vi.fn(),
  },
  getInterviewErrorMessage: () => 'lỗi',
}));

const mockedApi = vi.mocked(interviewApi);

function listItem(status: InterviewSessionStatus, fallbackMode = false): InterviewSessionListItem {
  return {
    id: 'session-1',
    startedAt: new Date(2026, 7, 13, 21, 40).toISOString(),
    endedAt: status === 'completed' ? new Date(2026, 7, 13, 22, 6).toISOString() : null,
    status,
    fallbackMode,
    plan: { id: 'plan-1', name: 'Cấu trúc dữ liệu & Giải thuật' },
    conceptTotal: 1,
    averageMasteryScore: 0.42,
    concepts: [
      {
        conceptId: 'concept-1',
        name: 'Duyệt đồ thị DFS',
        masteryBefore: null,
        masteryAfter: 0.42,
        isFirstAssessment: true,
      },
    ],
  };
}

function transcript(status: InterviewSessionStatus): GetInterviewResponse {
  return {
    session: {
      id: 'session-1',
      planId: 'plan-1',
      status,
      fallbackMode: false,
      startedAt: new Date(2026, 7, 13, 21, 40).toISOString(),
      endedAt: null,
      currentConcept: { id: 'concept-1', name: 'Duyệt đồ thị DFS' },
      progress: {
        conceptIndex: 0,
        conceptTotal: 1,
        completedConcepts: 0,
        turnIndex: 1,
        maxTurnsPerConcept: 3,
      },
    },
    currentQuestion: null,
    turns: [
      {
        id: 'turn-1',
        conceptId: 'concept-1',
        conceptName: 'Duyệt đồ thị DFS',
        turnIndex: 1,
        questionText: 'DFS duyệt một đồ thị theo thứ tự như thế nào?',
        questionType: 'recall',
        answerText: 'Đi sâu hết một nhánh rồi quay lại.',
        score: 0.42,
        feedback: 'Đúng ý chính nhưng dừng ở mô tả.',
        verdict: 'shallow',
        askedAt: new Date(2026, 7, 13, 21, 41).toISOString(),
        answeredAt: new Date(2026, 7, 13, 21, 43).toISOString(),
        sourceCitation: null,
      },
    ],
    fallback: null,
  };
}

/** Phiên bỏ dở: `summarize_session` cố tình không chạy ⇒ `text` VÀ `message` đều `null`. */
function abandonedSummary(): SessionSummaryResponse {
  return {
    sessionId: 'session-1',
    status: 'abandoned',
    durationMinutes: 14,
    concepts: [
      {
        conceptId: 'concept-1',
        name: 'Duyệt đồ thị DFS',
        masteryScore: 0.42,
        turns: [{ turnIndex: 1, score: 0.42, verdict: 'shallow' }],
      },
    ],
    summary: {
      text: null,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      generatedByAi: false,
      message: null,
    },
    reviewSchedule: [],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SessionDetailPanel — phiên nào thì đọc API nào', () => {
  it('phiên đã đóng đọc cả transcript lẫn /summary', async () => {
    mockedApi.getInterview.mockResolvedValue(transcript('completed'));
    mockedApi.getSummary.mockResolvedValue({
      ...abandonedSummary(),
      status: 'completed',
      summary: {
        text: 'Bạn mô tả đúng cách DFS đi sâu.',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        generatedByAi: true,
        message: null,
      },
    });

    render(<SessionDetailPanel session={listItem('completed')} onSessionChanged={() => {}} />);

    await waitFor(() => expect(mockedApi.getSummary).toHaveBeenCalledWith('session-1'));
    expect(mockedApi.getInterview).toHaveBeenCalledWith('session-1');
    expect(await screen.findByText(/Bạn mô tả đúng cách DFS đi sâu/)).toBeInTheDocument();
  });

  it('phiên tạm dừng KHÔNG gọi /summary — endpoint đó ném 409 cho phiên chưa đóng', async () => {
    mockedApi.getInterview.mockResolvedValue(transcript('paused'));

    render(<SessionDetailPanel session={listItem('paused')} onSessionChanged={() => {}} />);

    await waitFor(() => expect(mockedApi.getInterview).toHaveBeenCalledWith('session-1'));
    expect(mockedApi.getSummary).not.toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: /Tiếp tục phiên/ })).toBeInTheDocument();
  });

  /**
   * `GET /interviews/:id` cho phiên `active` chạy máy trạng thái và có thể gọi Gemini sinh câu
   * hỏi mới. Màn Lịch sử là read-only, nên nó không được đụng vào phiên đang chạy.
   */
  it('phiên đang chạy KHÔNG gọi API nào cả', async () => {
    render(<SessionDetailPanel session={listItem('active')} onSessionChanged={() => {}} />);

    expect(await screen.findByText(/Phiên này vẫn đang mở/)).toBeInTheDocument();
    expect(mockedApi.getInterview).not.toHaveBeenCalled();
    expect(mockedApi.getSummary).not.toHaveBeenCalled();
  });
});

describe('SessionDetailPanel — AF3 phiên bỏ dở', () => {
  it('bỏ HẲN khối nhận xét, không hiện khung trống hay câu báo lỗi', async () => {
    mockedApi.getInterview.mockResolvedValue(transcript('abandoned'));
    mockedApi.getSummary.mockResolvedValue(abandonedSummary());

    render(<SessionDetailPanel session={listItem('abandoned')} onSessionChanged={() => {}} />);

    expect(await screen.findByText('Biến động mastery_score')).toBeInTheDocument();
    expect(screen.queryByText('Nhận xét cuối phiên')).not.toBeInTheDocument();
    // `AiSummaryCard` dịch `message: null` thành câu báo lỗi của UC-14 E1 kèm icon cảnh báo.
    // Phiên bỏ dở không có gì hỏng cả, nên câu đó không được xuất hiện ở đây.
    expect(screen.queryByText(/Không thể tổng hợp nhận xét lúc này/)).not.toBeInTheDocument();
  });

  it('khái niệm lần đầu hiện giá trị tuyệt đối kèm nhãn "lần đầu", không hiện +0.42', async () => {
    mockedApi.getInterview.mockResolvedValue(transcript('abandoned'));
    mockedApi.getSummary.mockResolvedValue(abandonedSummary());

    render(<SessionDetailPanel session={listItem('abandoned')} onSessionChanged={() => {}} />);

    expect(await screen.findByText('lần đầu')).toBeInTheDocument();
    expect(screen.queryByText('+0.42')).not.toBeInTheDocument();
  });
});

describe('SessionDetailPanel — AF4 phiên tự chấm', () => {
  it('gắn nhãn tự chấm ở đầu panel', async () => {
    mockedApi.getInterview.mockResolvedValue(transcript('completed'));
    mockedApi.getSummary.mockResolvedValue({ ...abandonedSummary(), status: 'completed' });

    render(
      <SessionDetailPanel session={listItem('completed', true)} onSessionChanged={() => {}} />
    );

    expect(await screen.findByText(/flashcard đã lưu sẵn/)).toBeInTheDocument();
  });
});
