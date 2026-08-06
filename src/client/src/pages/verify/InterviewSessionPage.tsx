import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaMono } from '@/components/ui/kbd';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { QuestionCard } from '@/features/interview/components/QuestionCard';
import { AnswerInput } from '@/features/interview/components/AnswerInput';
import { TurnHistory } from '@/features/interview/components/TurnHistory';
import { VerdictBadge } from '@/features/interview/components/VerdictBadge';
import { FallbackBanner } from '@/features/interview/components/FallbackBanner';
import { useInterviewSession } from '@/features/interview/hooks/useInterviewSession';
import type {
  InterviewProgress,
  InterviewTurnResponse,
  SubmitAnswerResponse,
} from '@/features/interview/types/interview.types';

/**
 * AE-02 — màn phỏng vấn nhiều lượt do state machine tất định điều phối.
 *
 * Bố cục 2 cột phỏng theo `screen-interview.html` (`.ex-shell`): thanh trên (thoát phiên +
 * mét tiến độ) cố định, rồi tới cột trái "phạm vi bài kiểm tra" (hàng đợi khái niệm + lượt)
 * và cột phải (thanh khái niệm + hội thoại cuộn riêng + khu trả lời ghim đáy). Khi phiên rơi
 * vào fallback (AE-05) thì thay ô gõ bằng ba nút tự chấm và hiện băng cảnh báo. Toàn bộ state
 * do `useInterviewSession` sở hữu — server là nguồn chân lý, trang này chỉ trình bày lại.
 */
export default function InterviewSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Chỉ rời phiên đúng một lần: cả nhánh hoàn thành trực tiếp (sau khi gửi) và nhánh mở
  // một phiên đã kết thúc từ trước (reload URL) đều đi qua đây, nên toast + redirect
  // không bị nhân đôi.
  const hasExitedRef = useRef(false);
  const exitToDashboard = useCallback(
    (showToast: () => void): void => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;
      showToast();
      navigate('/dashboard');
    },
    [navigate]
  );

  const handleCompleted = useCallback(
    (result: SubmitAnswerResponse): void => {
      exitToDashboard(() => {
        // Nhánh E1 (UC-12): fallback cần câu hỏi cache nhưng không còn → kết thúc sớm.
        if (result.fallback?.reason === 'no_cached_questions') {
          toast.info('Đã hết câu hỏi có sẵn cho chế độ ngoại tuyến. Phiên kiểm tra kết thúc.');
        } else {
          toast.success('Bạn đã hoàn thành phiên kiểm tra.');
        }
      });
    },
    [exitToDashboard]
  );

  const {
    session,
    currentQuestion,
    turns,
    isLoading,
    isSubmitting,
    error,
    submit,
    submitSelfGrade,
    pause,
    refetch,
  } = useInterviewSession(sessionId, { onCompleted: handleCompleted });

  // BUG-2: mở URL của một phiên đã ở trạng thái kết thúc (completed/abandoned) — ví dụ
  // reload sau khi xong, hoặc phiên bị bỏ dở. `onCompleted` chỉ bắn sau khi gửi nên
  // không phủ trường hợp này; ở đây phát hiện lúc load rồi đưa người dùng ra ngoài
  // (màn kết quả I6.7 là issue riêng, toast + redirect là mức xử lý tối thiểu đúng).
  const sessionStatus = session?.status;
  useEffect(() => {
    if (sessionStatus === 'completed' || sessionStatus === 'abandoned') {
      exitToDashboard(() => toast.info('Phiên đã kết thúc.'));
    }
  }, [sessionStatus, exitToDashboard]);

  const handlePause = async (): Promise<void> => {
    const ok = await pause();
    if (ok) {
      toast.success('Đã tạm dừng. Bạn có thể tiếp tục phiên này sau.');
      navigate('/dashboard');
    }
  };

  // ---------- Loading khôi phục lần đầu ----------
  if (isLoading && !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  // ---------- Lỗi tải phiên ----------
  if (error && !session) {
    return (
      <div className="border-border bg-background mx-auto max-w-2xl rounded-xl border px-7 py-6 text-center">
        <p className="text-muted-foreground mb-5 text-[13.5px] leading-[1.7]">{error}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (!session) return null;

  const { progress, currentConcept, fallbackMode } = session;
  // "Tạm dừng" chỉ hợp lệ khi phiên đang chạy — backend từ chối pause phiên không active.
  const isActive = session.status === 'active';
  // completedConcepts là số khái niệm đã chốt; +1 là khái niệm đang hỏi (không vượt tổng).
  const conceptPosition = Math.min(progress.completedConcepts + 1, progress.conceptTotal);
  const turnIndex = progress.turnIndex ?? currentQuestion?.turnIndex ?? null;
  // Câu hỏi đang chờ đã nằm trong transcript — lọc ra để không hiện trùng với QuestionCard.
  const historyTurns = turns.filter((turn) => turn.id !== currentQuestion?.turnId);

  return (
    // Khoá đúng một viewport (trừ phần chrome MainLayout đã chiếm: header mobile h-16
    // dưới lg, cộng padding p-4/md:p-8 của <main>) để hội thoại tự cuộn bên trong và khu
    // trả lời luôn nhìn thấy, thay vì đẩy nút "Gửi" xuống dưới mép màn hình.
    <div className="flex h-[calc(100dvh-6rem)] flex-col md:h-[calc(100dvh-8rem)] lg:h-[calc(100dvh-4rem)]">
      {/* Thanh trên: thoát phiên + tiêu đề + mét tiến độ cấp phiên. */}
      <header className="border-border flex flex-wrap items-center gap-x-5 gap-y-3 border-b pb-4">
        {isActive && (
          <Button variant="outline" size="sm" onClick={() => void handlePause()}>
            <ArrowLeft />
            Tạm dừng &amp; thoát
          </Button>
        )}

        <h1 className="font-heading text-xl tracking-[-0.01em]">Kiểm tra vấn đáp</h1>

        <ConceptMeter progress={progress} className="ml-auto" />
      </header>

      {fallbackMode && <FallbackBanner />}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 pt-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Cột trái: phạm vi bài kiểm tra — không có ở mobile/tablet, ngữ cảnh vẫn còn
            nguyên trong cbar của cột phải. */}
        <aside
          aria-label="Phạm vi bài kiểm tra"
          className="border-border hidden min-h-0 flex-col gap-6 overflow-y-auto border-r pr-5 lg:flex"
        >
          <ConceptQueueRail progress={progress} currentConceptName={currentConcept?.name ?? null} />
          <TurnStackRail
            progress={progress}
            currentConceptId={currentConcept?.id ?? null}
            currentConceptName={currentConcept?.name ?? null}
            turnIndex={turnIndex}
            turns={turns}
          />
        </aside>

        {/* Cột phải: thanh khái niệm + hội thoại (cuộn riêng) + khu trả lời (ghim đáy). */}
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="border-border gap-x-4.5 flex flex-wrap items-center gap-y-2 border-b pb-3">
            <div className="flex min-w-0 items-baseline gap-3">
              <h2 className="font-heading truncate text-lg tracking-[-0.01em]">
                {currentConcept?.name ?? 'Đang tải…'}
              </h2>
              <MetaMono className="text-muted-foreground whitespace-nowrap text-xs">
                khái niệm {conceptPosition}/{progress.conceptTotal}
              </MetaMono>
            </div>

            {turnIndex !== null && (
              <span className="text-muted-foreground ml-auto flex items-center gap-2 whitespace-nowrap text-xs">
                <TurnPips turnIndex={turnIndex} maxTurns={progress.maxTurnsPerConcept} />
                Lượt <strong className="text-foreground">{turnIndex}</strong>/
                {progress.maxTurnsPerConcept}
              </span>
            )}

            {/* AE-04 hoãn sang Sprint 5 — nút hiển thị nhưng vô hiệu hóa, không nối API.
                Nằm cạnh ngữ cảnh khái niệm vì đây là hành động theo khái niệm, không phải
                hành động cấp phiên như "Tạm dừng & thoát" ở thanh trên. */}
            <Button
              variant="ghost"
              size="sm"
              disabled
              className={turnIndex === null ? 'ml-auto' : undefined}
              title="Tính năng bỏ qua khái niệm sẽ có ở Sprint 5"
            >
              Bỏ qua khái niệm
              <span className="text-muted-foreground ml-1.5 text-[11px]">Sprint 5</span>
            </Button>
          </div>

          {/* Transcript + câu hỏi / trạng thái chờ — cuộn độc lập với khu trả lời. */}
          <div className="flex flex-col gap-5 overflow-y-auto py-5">
            <TurnHistory turns={historyTurns} />

            {currentQuestion && <QuestionCard question={currentQuestion} />}
            {isSubmitting && (fallbackMode ? <SavingIndicator /> : <WaitingForAi />)}
          </div>

          {/* Khu trả lời — gõ (mặc định) hoặc tự chấm flashcard (fallback). Ghim đáy: cột
              cha là grid-rows auto/1fr/auto nên hàng này luôn nhìn thấy dù transcript dài. */}
          {currentQuestion && (
            <footer className="border-border border-t pt-4">
              {fallbackMode ? (
                <div>
                  <p className="text-muted-foreground mb-3 text-[13px]">
                    Tự đánh giá câu trả lời của bạn cho câu hỏi trên:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      variant="outline"
                      onClick={() => void submitSelfGrade('correct')}
                      disabled={isSubmitting}
                    >
                      Đúng
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => void submitSelfGrade('partial')}
                      disabled={isSubmitting}
                    >
                      Một phần
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => void submitSelfGrade('wrong')}
                      disabled={isSubmitting}
                    >
                      Sai
                    </Button>
                  </div>
                </div>
              ) : (
                <AnswerInput onSubmit={submit} isSubmitting={isSubmitting} />
              )}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Mét tiến độ cấp phiên (`.meter` trong mockup): mỗi đoạn là một khái niệm. Không có
 * điểm mastery cho từng khái niệm ở tầng dữ liệu này nên tô 3 trạng thái trung tính —
 * đã xong / đang hỏi / chưa tới — thay vì bịa điểm.
 */
function ConceptMeter({
  progress,
  className,
}: {
  progress: InterviewProgress;
  className?: string;
}) {
  const segments = Array.from({ length: progress.conceptTotal }, (_, i) => {
    if (i < progress.completedConcepts) return 'done';
    if (i === progress.completedConcepts) return 'now';
    return 'pending';
  });

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <div className="flex items-center gap-1" aria-hidden="true">
        {segments.map((state, i) => (
          <span
            key={i}
            className={`h-1 w-6 rounded-full ${
              state === 'done'
                ? 'bg-muted-foreground'
                : state === 'now'
                  ? 'bg-ai-accent'
                  : 'bg-mastery-untested'
            }`}
          />
        ))}
      </div>
      <MetaMono className="text-muted-foreground whitespace-nowrap text-xs">
        Khái niệm {Math.min(progress.completedConcepts + 1, progress.conceptTotal)}/
        {progress.conceptTotal}
      </MetaMono>
    </div>
  );
}

/** Pips lượt trong cbar (`.pips`) — dùng lại đúng 3 trạng thái với ConceptMeter. */
function TurnPips({ turnIndex, maxTurns }: { turnIndex: number; maxTurns: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: maxTurns }, (_, i) => (
        <span
          key={i}
          className={`h-0.5 w-4 rounded-full ${
            i < turnIndex - 1
              ? 'bg-mastery-strong'
              : i === turnIndex - 1
                ? 'bg-ai-accent'
                : 'bg-border'
          }`}
        />
      ))}
    </span>
  );
}

/**
 * Hàng đợi khái niệm (`.rail__queue`). Chỉ derive được từ `InterviewProgress`: tổng số +
 * số đã xong + khái niệm đang hỏi. Không có tên/điểm của các khái niệm còn lại trong hàng
 * đợi ở tầng dữ liệu này (server chưa trả), nên không bịa — dùng nhãn số thứ tự chung.
 */
function ConceptQueueRail({
  progress,
  currentConceptName,
}: {
  progress: InterviewProgress;
  currentConceptName: string | null;
}) {
  const slots = Array.from({ length: progress.conceptTotal }, (_, i) => i);

  return (
    <section>
      <h2 className="text-muted-foreground mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em]">
        Hàng đợi khái niệm
      </h2>
      <div className="flex flex-col gap-0.5">
        {slots.map((i) => {
          const no = String(i + 1).padStart(2, '0');
          const isDone = i < progress.completedConcepts;
          const isNow = i === progress.completedConcepts;
          return (
            <div
              key={i}
              aria-current={isNow ? 'step' : undefined}
              className={`grid grid-cols-[20px_minmax(0,1fr)] items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] ${
                isNow
                  ? 'border-foreground bg-card border font-semibold'
                  : isDone
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground'
              }`}
            >
              <MetaMono className="text-muted-foreground text-[11px]">{no}</MetaMono>
              <span className="min-w-0 truncate">
                {isNow ? (currentConceptName ?? 'Đang hỏi') : `Khái niệm ${no}`}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Ngăn xếp lượt của khái niệm đang hỏi (`.rail__turns`). Trạng thái mỗi lượt tra thẳng
 * từ transcript đã tải (`turns`) — không đếm/suy đoán phía client. Trọng số lượt (×0.2/
 * ×0.3/×0.5 trong mockup) không có sẵn qua API nên không hiển thị, tránh bịa số.
 */
function TurnStackRail({
  progress,
  currentConceptId,
  currentConceptName,
  turnIndex,
  turns,
}: {
  progress: InterviewProgress;
  currentConceptId: string | null;
  currentConceptName: string | null;
  turnIndex: number | null;
  turns: InterviewTurnResponse[];
}) {
  if (!currentConceptId) return null;

  const slots = Array.from({ length: progress.maxTurnsPerConcept }, (_, i) => i + 1);

  return (
    <section>
      <h2 className="text-muted-foreground mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em]">
        Lượt — {currentConceptName ?? ''}
      </h2>
      <div className="border-border divide-border bg-card divide-y overflow-hidden rounded-md border">
        {slots.map((n) => {
          const graded = turns.find(
            (t) => t.conceptId === currentConceptId && t.turnIndex === n && t.verdict !== null
          );
          const isNow = !graded && n === turnIndex;
          return (
            <div
              key={n}
              className={`grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2.5 px-3 py-2.5 text-[13px] ${
                isNow ? 'bg-ai-accent/7' : ''
              }`}
            >
              <MetaMono className="text-muted-foreground text-[11px]">{n}</MetaMono>
              {graded ? (
                <span className="flex min-w-0 items-center gap-2">
                  {graded.verdict && <VerdictBadge verdict={graded.verdict} />}
                  {graded.score !== null && (
                    <MetaMono className="text-[12px]">{graded.score.toFixed(2)}</MetaMono>
                  )}
                </span>
              ) : (
                <span className={isNow ? 'text-foreground' : 'text-muted-foreground'}>
                  {isNow ? 'Đang trả lời' : 'Chưa mở'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Trạng thái gặp nhiều nhất trong một phiên: chờ AI chấm rồi sinh câu hỏi kế tiếp. Vẽ
 * skeleton theo hình bong bóng câu hỏi (không phải spinner tròn) để sinh viên biết cái
 * gì sắp hiện ra — không bao giờ để màn hình trắng.
 */
function WaitingForAi() {
  return (
    <ChatBubble role="ai" className="max-w-full">
      <div className="flex flex-col gap-2.5" aria-hidden="true">
        <div className="bg-ai-accent/16 h-2.5 w-full animate-pulse rounded" />
        <div className="bg-ai-accent/16 h-2.5 w-11/12 animate-pulse rounded" />
        <div className="bg-ai-accent/16 h-2.5 w-1/2 animate-pulse rounded" />
      </div>
      <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs" role="status">
        <Loader2 className="size-3.5 animate-spin" />
        AI đang chấm câu trả lời của bạn…
      </p>
    </ChatBubble>
  );
}

/**
 * Chỉ báo lưu trung tính cho chế độ flashcard fallback (AE-05): AI đang hỏng, sinh viên
 * tự chấm nên không có bước "AI chấm" — chỉ đang ghi kết quả tự chấm và lấy câu hỏi kế.
 */
function SavingIndicator() {
  return (
    <p className="text-muted-foreground flex items-center gap-2 text-xs" role="status">
      <Loader2 className="size-3.5 animate-spin" />
      Đang lưu…
    </p>
  );
}
