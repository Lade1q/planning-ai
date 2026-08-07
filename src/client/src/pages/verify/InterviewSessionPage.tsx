import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaMono } from '@/components/ui/kbd';
import { ChatBubble } from '@/components/ui/chat-bubble';
import { cn } from '@/lib/utils';
import { QuestionCard } from '@/features/interview/components/QuestionCard';
import { AnswerInput } from '@/features/interview/components/AnswerInput';
import { TurnHistory } from '@/features/interview/components/TurnHistory';
import { VerdictBadge } from '@/features/interview/components/VerdictBadge';
import { FallbackBanner } from '@/features/interview/components/FallbackBanner';
import { useInterviewSession } from '@/features/interview/hooks/useInterviewSession';
import type {
  InterviewProgress,
  InterviewTurnResponse,
  SelfGrade,
  SubmitAnswerResponse,
} from '@/features/interview/types/interview.types';

/**
 * AE-02 — màn phỏng vấn nhiều lượt do state machine tất định điều phối.
 *
 * Bố cục phỏng theo `screen-interview.html` (`.ex-shell`): một màn chiếm trọn khung nhìn,
 * KHÔNG có sidebar/nav của app (xem `InterviewLayout`), gồm thanh trên 3 vùng (thoát phiên
 * + tiêu đề | mét tiến độ | vùng phải để trống), rồi cột trái "phạm vi bài kiểm tra" (hàng
 * đợi khái niệm + lượt) và cột phải (thanh khái niệm + hội thoại cuộn riêng + khu trả lời
 * ghim đáy). Khi phiên rơi vào fallback (AE-05) thì thay ô gõ bằng ba nút tự chấm và hiện
 * băng cảnh báo. Toàn bộ state do `useInterviewSession` sở hữu — server là nguồn chân lý,
 * trang này chỉ trình bày lại.
 */

/**
 * Nhánh E1 (UC-12): fallback cần câu hỏi cache nhưng khái niệm không có câu nào. Dùng chung
 * một câu chữ cho cả hai đường phát hiện (ngay sau khi gửi, và lúc mở/tải lại phiên) — hai
 * lối vào cùng một sự thật thì không được nói hai kiểu khác nhau.
 */
const NO_CACHED_QUESTIONS_MESSAGE =
  'AI hiện chưa khả dụng và khái niệm này chưa có câu hỏi lưu sẵn. Hãy thử lại sau.';

/**
 * Ba mức tự chấm của chế độ flashcard (AE-05). Con số chỉ để sinh viên biết mình đang gán
 * điểm nào (khớp `SELF_GRADE_SCORE` phía server) — payload gửi đi vẫn chỉ là `selfGrade`.
 */
const SELF_GRADE_OPTIONS: ReadonlyArray<{ grade: SelfGrade; label: string; value: string }> = [
  { grade: 'correct', label: 'Đúng', value: '1.0' },
  { grade: 'partial', label: 'Một phần', value: '0.5' },
  { grade: 'wrong', label: 'Sai', value: '0.0' },
];

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
        if (result.fallback?.reason === 'no_cached_questions') {
          toast.warning(NO_CACHED_QUESTIONS_MESSAGE);
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
    fallback,
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
  //
  // Không phải mọi phiên kết thúc đều là "làm xong": GET có thể vừa chạy nhánh E1 (AI hỏng
  // + khái niệm không có câu hỏi cache) và tự đóng phiên. Nói "Phiên đã kết thúc" ở đó là
  // để người dùng tưởng mình đã hoàn thành bài kiểm tra.
  const sessionStatus = session?.status;
  const fallbackReason = fallback?.reason;
  useEffect(() => {
    if (sessionStatus !== 'completed' && sessionStatus !== 'abandoned') return;
    exitToDashboard(() => {
      if (fallbackReason === 'no_cached_questions') {
        toast.warning(NO_CACHED_QUESTIONS_MESSAGE);
      } else {
        toast.info('Phiên đã kết thúc.');
      }
    });
  }, [sessionStatus, fallbackReason, exitToDashboard]);

  // Lượt đang chờ đã mang câu trả lời (echo lạc quan lúc gửi, hoặc một câu trả lời đã lưu mà
  // lượt chấm bị hỏng) thì chính TurnHistory vẽ cặp câu hỏi + câu trả lời: bỏ lọc lượt đó và
  // tắt QuestionCard để không vẽ câu hỏi hai lần. Khi đang gửi, thứ sắp hiện ra là THẺ ĐIỂM
  // nên skeleton phải mang hình thẻ điểm, không phải hình bong bóng câu hỏi.
  const pendingTurn = currentQuestion
    ? turns.find((turn) => turn.id === currentQuestion.turnId)
    : undefined;
  const pendingTurnAnswered = pendingTurn?.answerText != null;

  // BUG B2: hội thoại là dạng "chat" trực tiếp, không phải tài liệu người dùng chủ động
  // cuộn lên đọc lại — nên mỗi khi có nội dung mới (lượt mới, câu hỏi mới đổi, hoặc câu trả
  // lời vừa được echo lạc quan) phải tự cuộn xuống đáy, kể cả lần dựng đầu tiên lúc khôi
  // phục phiên. Đặt scrollTop = scrollHeight lên chính khung cuộn là đủ, không cần thư viện
  // smooth-scroll nào (Platform Leverage Ladder). Đặt trước các early return bên dưới vì
  // hook phải chạy ở cùng một thứ tự trong mọi lần render (rules-of-hooks).
  const transcriptScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = transcriptScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns.length, currentQuestion?.turnId, pendingTurnAnswered]);

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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  // ---------- Lỗi tải phiên ----------
  if (error && !session) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="border-border bg-card w-full max-w-lg rounded-xl border px-7 py-6 text-center">
          <p className="text-muted-foreground mb-5 text-[13.5px] leading-[1.7]">{error}</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Thử lại
          </Button>
        </div>
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

  return (
    // `.ex-shell`: khoá đúng một viewport (layout đã cấp h-dvh) để hội thoại tự cuộn bên
    // trong và khu trả lời luôn nhìn thấy, thay vì đẩy nút "Gửi" xuống dưới mép màn hình.
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden">
      {/* `.ex-top` — ba vùng cân nhau: đường ra + tiêu đề bên trái, tiến độ ở GIỮA. Vùng
          phải của mockup (toggle giọng nói I6.9, bánh răng cài đặt) đều ngoài phạm vi nên
          để trống — vẫn giữ đủ ba rãnh để mét tiến độ đứng đúng giữa màn. Tên kế hoạch
          (dòng phụ trong mockup) không có trong dữ liệu phiên nên không hiển thị. */}
      <header className="border-border bg-card grid grid-cols-[1fr_auto_1fr] items-center gap-5 border-b px-6 py-3">
        <div className="flex min-w-0 items-center gap-3.5">
          {/* Màn này không còn nav của app, nên nút thoát là đường ra DUY NHẤT: phiên chưa
              active (paused mà auto-resume chưa ăn, hoặc đang kết thúc) vẫn phải có lối về,
              chỉ khác là về thẳng Dashboard chứ không gọi pause. */}
          {isActive ? (
            <Button variant="outline" size="sm" onClick={() => void handlePause()}>
              <ArrowLeft />
              Tạm dừng &amp; thoát
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft />
              Về Dashboard
            </Button>
          )}
          <h1 className="truncate text-sm font-semibold">Kiểm tra vấn đáp</h1>
        </div>

        <ConceptMeter progress={progress} className="hidden md:flex" />
      </header>

      <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[288px_minmax(0,1fr)]">
        {/* `.rail` — phạm vi bài kiểm tra. Không có ở mobile/tablet, ngữ cảnh vẫn còn
            nguyên trong thanh khái niệm của cột phải. */}
        <aside
          aria-label="Phạm vi bài kiểm tra"
          className="border-border bg-sidebar gap-6.5 pt-5.5 hidden min-h-0 flex-col overflow-y-auto border-r px-5 pb-5 lg:flex"
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
        <div className="flex min-h-0 flex-col">
          <div className="border-border gap-x-4.5 flex flex-none flex-wrap items-center gap-y-2 border-b px-5 py-3.5 lg:px-8">
            <div className="flex min-w-0 items-baseline gap-3">
              <h2 className="font-heading truncate text-xl tracking-[-0.02em]">
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

          {fallbackMode && (
            <div className="flex-none px-5 pt-4 lg:px-8">
              <div className="mx-auto w-full max-w-[680px]">
                <FallbackBanner />
              </div>
            </div>
          )}

          {/* Transcript + câu hỏi / trạng thái chờ — cuộn độc lập với khu trả lời. */}
          <div
            ref={transcriptScrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-5 lg:px-8"
          >
            <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5">
              <TurnHistory
                turns={turns}
                currentTurnId={pendingTurnAnswered ? null : (currentQuestion?.turnId ?? null)}
                maxTurnsPerConcept={progress.maxTurnsPerConcept}
                fallbackMode={fallbackMode}
              />

              {currentQuestion && !pendingTurnAnswered && (
                <QuestionCard question={currentQuestion} />
              )}
              {/* Chờ cái gì thì vẽ hình cái đó. Nhánh cuối còn đòi `!currentQuestion`: sau
                  khi delta update chạy, câu hỏi mới đã hiện trên màn trong lúc `isSubmitting`
                  vẫn còn bật (đang đồng bộ lại transcript) — nói "đang soạn câu hỏi" ngay
                  dưới câu hỏi vừa hiện là sai sự thật. */}
              {isSubmitting &&
                (fallbackMode ? (
                  <SavingIndicator />
                ) : pendingTurnAnswered ? (
                  <WaitingForGrade turnIndex={pendingTurn?.turnIndex ?? null} />
                ) : !currentQuestion ? (
                  <WaitingForQuestion />
                ) : null)}
            </div>
          </div>

          {/* `.dock` — gõ (mặc định) hoặc tự chấm flashcard (fallback). Luôn nhìn thấy vì
              cột này là flex-col và chỉ vùng hội thoại ở trên mới cuộn. */}
          {currentQuestion && (
            <footer className="border-border bg-card flex-none border-t px-5 py-4 lg:px-8">
              <div className="mx-auto w-full max-w-[680px]">
                {fallbackMode ? (
                  <div>
                    <p className="text-muted-foreground mb-3 text-[13px]">
                      Tự trả lời trong đầu, rồi chọn mức độ đúng của bạn.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {SELF_GRADE_OPTIONS.map(({ grade, label, value }) => (
                        <Button
                          key={grade}
                          variant="outline"
                          onClick={() => void submitSelfGrade(grade)}
                          disabled={isSubmitting}
                        >
                          {label}
                          <MetaMono className="text-muted-foreground text-[11px]">{value}</MetaMono>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AnswerInput onSubmit={submit} isSubmitting={isSubmitting} />
                )}
              </div>
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
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex items-center gap-1" aria-hidden="true">
        {segments.map((state, i) => (
          <span
            key={i}
            className={cn(
              'h-1 w-6 rounded-full',
              state === 'done'
                ? 'bg-muted-foreground'
                : state === 'now'
                  ? 'bg-ai-accent'
                  : 'bg-mastery-untested'
            )}
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
          className={cn(
            'h-0.5 w-4 rounded-full',
            i < turnIndex - 1
              ? 'bg-mastery-strong'
              : i === turnIndex - 1
                ? 'bg-ai-accent'
                : 'bg-border'
          )}
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
          const isNow = i === progress.completedConcepts;
          return (
            <div
              key={i}
              aria-current={isNow ? 'step' : undefined}
              className={cn(
                'grid grid-cols-[20px_minmax(0,1fr)] items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px]',
                isNow ? 'border-foreground bg-card border font-semibold' : 'text-muted-foreground'
              )}
            >
              <MetaMono className="text-muted-foreground text-[11px]">{no}</MetaMono>
              {/* FIX E: server không trả tên cho khái niệm nào ngoài khái niệm đang hỏi — kể
                  cả khái niệm đã xong lẫn khái niệm chưa tới lượt. "Khái niệm N" cũ đọc như
                  tên thật, dễ hiểu lầm. Dùng gạch ngang trung tính thay vì bịa chữ, số thứ tự
                  đã có sẵn ở cột MetaMono bên trái rồi nên không mất thông tin. */}
              <span className="min-w-0 truncate">
                {isNow ? (currentConceptName ?? 'Đang hỏi') : '—'}
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
 *
 * FIX F: `maxTurnsPerConcept` là trần cứng có thật (C6), nhưng `decideNextStep` có thể
 * dừng khái niệm sớm khi đạt mastery — nên lượt chưa mở KHÔNG chắc sẽ xảy ra. Nhãn "Chưa
 * mở" cũ đọc như một lời hứa "chắc chắn sắp tới"; ở đây đổi chữ + hạ độ đậm để đọc đúng là
 * "có thể, không chắc" thay vì tháo hẳn slot (số trần vẫn là dữ liệu thật, không bịa).
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
          // Chưa được chấm và không phải lượt đang hỏi: có thể sẽ không bao giờ mở nếu
          // khái niệm dừng sớm — hạ độ đậm để đọc như "chưa chắc" chứ không phải "sắp tới".
          const notYetReached = !graded && !isNow;
          return (
            <div
              key={n}
              className={cn(
                'grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2.5 px-3 py-2.5 text-[13px]',
                isNow && 'bg-ai-accent/7',
                notYetReached && 'opacity-55'
              )}
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
                  {isNow ? 'Đang trả lời' : 'Có thể chưa cần'}
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
 * Nguyên tắc mockup (`screen-interview.html:3343`): "Skeleton dựng theo hình dạng của thứ
 * sắp hiện ra, không phải spinner tròn — sinh viên biết mình đang chờ một câu hỏi hay một
 * thẻ điểm." Vì vậy có hai hình khác nhau, không dùng chung một cái.
 */
function SkeletonLines({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {widths.map((width, i) => (
        <div key={i} className={cn('bg-ai-accent/16 h-2.5 animate-pulse rounded', width)} />
      ))}
    </div>
  );
}

/** Chờ THẺ ĐIỂM (sau khi gửi câu trả lời): dựng theo đúng hình `.grade` của mockup. */
function WaitingForGrade({ turnIndex }: { turnIndex: number | null }) {
  return (
    <div className="border-border border-l-border bg-card rounded-md border border-l-2 px-4 py-3.5">
      <div className="mb-2 flex items-center gap-2.5" aria-hidden="true">
        <div className="bg-ai-accent/16 h-4.5 w-24 animate-pulse rounded-full" />
        <div className="bg-ai-accent/16 h-3 w-9 animate-pulse rounded" />
        {turnIndex !== null && (
          <span className="text-muted-foreground ml-auto text-[11px]">Lượt {turnIndex}</span>
        )}
      </div>
      <SkeletonLines widths={['w-full', 'w-3/4']} />
      <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs" role="status">
        <Loader2 className="size-3.5 animate-spin" />
        AI đang đối chiếu câu trả lời với tài liệu gốc — ô trả lời tạm khóa.
      </p>
    </div>
  );
}

/** Chờ CÂU HỎI: dựng theo hình bong bóng AI, vì thứ sắp hiện ra là một câu hỏi mới. */
function WaitingForQuestion() {
  return (
    <ChatBubble role="ai" className="max-w-full">
      <SkeletonLines widths={['w-full', 'w-11/12', 'w-1/2']} />
      <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs" role="status">
        <Loader2 className="size-3.5 animate-spin" />
        AI đang soạn câu hỏi tiếp theo…
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
