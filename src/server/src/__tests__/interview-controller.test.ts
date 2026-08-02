import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createInterviewController,
  getInterviewController,
  pauseInterviewController,
  resumeInterviewController,
  submitAnswerController,
} from '../controllers/interview.controller';
import {
  getInterview,
  pauseInterview,
  resumeInterview,
  startInterview,
  submitAnswer,
} from '../services/interview.service';
import { AppError } from '../middleware/errorHandler';
import { MAX_TURNS_PER_CONCEPT } from '../utils/interview-state';

// Factory mock — no Prisma client constructed, so this passes without DATABASE_URL or a
// GEMINI_API_KEY (same pattern as review-queue-controller.test.ts).
jest.mock('../services/interview.service', () => ({
  __esModule: true,
  startInterview: jest.fn(),
  getInterview: jest.fn(),
  submitAnswer: jest.fn(),
  pauseInterview: jest.fn(),
  resumeInterview: jest.fn(),
}));

const mockedStart = startInterview as jest.Mock;
const mockedGet = getInterview as jest.Mock;
const mockedSubmit = submitAnswer as jest.Mock;
const mockedPause = pauseInterview as jest.Mock;
const mockedResume = resumeInterview as jest.Mock;

const USER_ID = 'user-owner-uuid';
const PLAN_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const SESSION_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
const CONCEPT_ID = '9b2f1a44-1c3d-4f0e-8f4a-2b6c5d7e8f90';

function mockRes(): Response {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createInterviewController', () => {
  it('throws 401 UNAUTHORIZED when req.userId is missing', async () => {
    const req = { body: { planId: PLAN_ID } } as unknown as Request;

    const error = await createInterviewController(req, mockRes()).catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
    expect(mockedStart).not.toHaveBeenCalled();
  });

  it('rejects a planId that is not a UUID before the service is reached', async () => {
    const req = { userId: USER_ID, body: { planId: 'not-a-uuid' } } as unknown as Request;

    const error = await createInterviewController(req, mockRes()).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);
    expect(mockedStart).not.toHaveBeenCalled();
  });

  it(`rejects maxTurnsPerConcept above the C6 limit of ${MAX_TURNS_PER_CONCEPT}`, async () => {
    const req = {
      userId: USER_ID,
      body: { planId: PLAN_ID, maxTurnsPerConcept: MAX_TURNS_PER_CONCEPT + 1 },
    } as unknown as Request;

    const error = await createInterviewController(req, mockRes()).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);
    expect(mockedStart).not.toHaveBeenCalled();
  });

  it('responds 201 with the new session and its first question', async () => {
    const data = { created: true, session: { id: SESSION_ID }, question: { turnIndex: 1 } };
    mockedStart.mockResolvedValue(data);
    const req = {
      userId: USER_ID,
      body: { planId: PLAN_ID, conceptIds: [CONCEPT_ID], maxTurnsPerConcept: 2 },
    } as unknown as Request;
    const res = mockRes();

    await createInterviewController(req, res);

    expect(mockedStart).toHaveBeenCalledWith(USER_ID, {
      planId: PLAN_ID,
      conceptIds: [CONCEPT_ID],
      maxTurnsPerConcept: 2,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  it('responds 200, not 201, when an unfinished session is handed back to resume (AE-03)', async () => {
    mockedStart.mockResolvedValue({ created: false, session: { id: SESSION_ID }, question: null });
    const req = { userId: USER_ID, body: { planId: PLAN_ID } } as unknown as Request;
    const res = mockRes();

    await createInterviewController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getInterviewController', () => {
  it('throws 401 UNAUTHORIZED when req.userId is missing', async () => {
    const req = { params: { id: SESSION_ID } } as unknown as Request;

    const error = await getInterviewController(req, mockRes()).catch((e) => e);

    expect(error).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
    expect(mockedGet).not.toHaveBeenCalled();
  });

  // InterviewSession.id is @db.Uuid: an id that is not a UUID reaches Prisma as P2023, which
  // errorHandler does not map, and falls through to 500 (same class of bug as #165/#191/#192).
  it('rejects a non-UUID id before the service is reached', async () => {
    const req = { userId: USER_ID, params: { id: '123' } } as unknown as Request;

    const error = await getInterviewController(req, mockRes()).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('responds 200 with the session state', async () => {
    const data = { session: { id: SESSION_ID }, currentQuestion: null, turns: [] };
    mockedGet.mockResolvedValue(data);
    const req = { userId: USER_ID, params: { id: SESSION_ID } } as unknown as Request;
    const res = mockRes();

    await getInterviewController(req, res);

    expect(mockedGet).toHaveBeenCalledWith(SESSION_ID, USER_ID);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });
});

describe('submitAnswerController', () => {
  it('throws 401 UNAUTHORIZED when req.userId is missing', async () => {
    const req = {
      params: { id: SESSION_ID },
      body: { answerText: 'một câu trả lời' },
    } as unknown as Request;

    const error = await submitAnswerController(req, mockRes()).catch((e) => e);

    expect(error).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it('rejects a whitespace-only answer without spending a grade_answer call', async () => {
    const req = {
      userId: USER_ID,
      params: { id: SESSION_ID },
      body: { answerText: '   ' },
    } as unknown as Request;

    const error = await submitAnswerController(req, mockRes()).catch((e) => e);

    expect(error).toBeInstanceOf(ZodError);
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it('passes the trimmed answer to the service and responds 200', async () => {
    const data = { grading: { score: 0.8 }, nextQuestion: null, sessionCompleted: true };
    mockedSubmit.mockResolvedValue(data);
    const req = {
      userId: USER_ID,
      params: { id: SESSION_ID },
      body: { answerText: '  Đệ quy là hàm tự gọi chính nó.  ' },
    } as unknown as Request;
    const res = mockRes();

    await submitAnswerController(req, res);

    expect(mockedSubmit).toHaveBeenCalledWith(
      SESSION_ID,
      USER_ID,
      'Đệ quy là hàm tự gọi chính nó.'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });
});

describe('pauseInterviewController / resumeInterviewController', () => {
  it('both throw 401 UNAUTHORIZED when req.userId is missing', async () => {
    const req = { params: { id: SESSION_ID } } as unknown as Request;

    const pauseError = await pauseInterviewController(req, mockRes()).catch((e) => e);
    const resumeError = await resumeInterviewController(req, mockRes()).catch((e) => e);

    expect(pauseError).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
    expect(resumeError).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
    expect(mockedPause).not.toHaveBeenCalled();
    expect(mockedResume).not.toHaveBeenCalled();
  });

  it('pauses and responds 200', async () => {
    mockedPause.mockResolvedValue({ session: { id: SESSION_ID, status: 'paused' } });
    const req = { userId: USER_ID, params: { id: SESSION_ID } } as unknown as Request;
    const res = mockRes();

    await pauseInterviewController(req, res);

    expect(mockedPause).toHaveBeenCalledWith(SESSION_ID, USER_ID);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('resumes and responds 200 with the question that was waiting', async () => {
    const data = {
      session: { id: SESSION_ID, status: 'active' },
      currentQuestion: { turnIndex: 2 },
    };
    mockedResume.mockResolvedValue(data);
    const req = { userId: USER_ID, params: { id: SESSION_ID } } as unknown as Request;
    const res = mockRes();

    await resumeInterviewController(req, res);

    expect(mockedResume).toHaveBeenCalledWith(SESSION_ID, USER_ID);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });
});
