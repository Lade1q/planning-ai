import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ConceptGraph } from '@/features/study-planner/components/ConceptGraph';
import { planApi, getRetryErrorMessage } from '@/features/study-planner/api/plan.api';
import { PlanDetails, Concept, ConceptEdge } from '@/features/study-planner/types/concept';

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Validate mode thực tế thay vì dùng `as` cast
  const rawMode = searchParams.get('mode');
  const mode: 'view' | 'edit' = rawMode === 'edit' ? 'edit' : 'view';

  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // Dùng ref để tránh vòng lặp vô hạn khi setSearchParams
  const hasAutoSwitchedToEdit = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isMountedRef = useRef(true);

  // Function declaration (không phải useCallback) để tự đệ quy khi polling và để
  // handleRetry gọi lại được, resume vòng poll sau khi POST /retry trả 202.
  async function fetchPlan() {
    if (!id) return;
    try {
      const data = await planApi.getPlan(id);
      if (!isMountedRef.current) return;

      setPlan(data);

      // Auto-switch draft plan sang edit mode (chỉ 1 lần duy nhất)
      if (data.status === 'draft' && rawMode !== 'edit' && !hasAutoSwitchedToEdit.current) {
        hasAutoSwitchedToEdit.current = true;
        setSearchParams({ mode: 'edit' }, { replace: true });
      }

      if (data.analysisStatus === 'pending' || data.analysisStatus === 'processing') {
        timeoutRef.current = setTimeout(fetchPlan, 2500);
      } else {
        if (data.analysisStatus === 'failed') {
          toast.error('Phân tích tài liệu thất bại (lỗi AI). Vui lòng thử lại.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('Failed to load plan', error);
      toast.error('Không thể tải dữ liệu kế hoạch.');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    isMountedRef.current = true;

    async function start() {
      setIsLoading(true);
      await fetchPlan();
    }
    start();

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ re-fetch khi id thay đổi
  }, [id]);

  const handleRetry = async () => {
    if (!id || isRetrying) return;
    setIsRetrying(true);
    try {
      await planApi.retryPlan(id);
      setIsLoading(true);
      fetchPlan();
    } catch (error) {
      console.error('Failed to retry plan analysis', error);
      toast.error(getRetryErrorMessage(error));
      // Đồng bộ lại trạng thái thật — tránh kẹt UI nếu plan đã đổi trạng thái ở nơi khác.
      fetchPlan();
    } finally {
      setIsRetrying(false);
    }
  };

  // Thêm try/catch cho handleConfirmGraph
  const handleConfirmGraph = async (concepts: Concept[], edges: ConceptEdge[]) => {
    if (!id) return;
    try {
      const result = await planApi.updatePlanGraph(id, concepts, edges);
      // After confirming, switch to view mode
      setSearchParams({ mode: 'view' });
      // Update local state to reflect changes
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: (result.data?.status as 'draft' | 'active' | 'completed') || prev.status,
          graph: { concepts, edges },
        };
      });
    } catch (error) {
      console.error('Failed to update plan graph', error);
      toast.error('Không thể lưu đồ thị. Vui lòng thử lại.');
    }
  };

  const analysisStatus = plan?.analysisStatus;
  const analysisRunning = analysisStatus === 'pending' || analysisStatus === 'processing';
  const analysisFailed = analysisStatus === 'failed';
  const analysisDone = !analysisRunning && !analysisFailed;

  // ----------------- EDIT MODE LAYOUT -----------------
  if (mode === 'edit') {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-[13px]">
          <button
            onClick={() => navigate('/plans')}
            className="hover:text-foreground hover:border-border border-b border-transparent pb-px transition-colors"
          >
            Kế hoạch ôn tập
          </button>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span>Tạo mới · {plan?.name || 'Loading...'}</span>
        </div>

        <h1 className="font-heading mb-2 text-[30px] leading-tight tracking-tight">
          Kiểm chứng đồ thị khái niệm
        </h1>
        <p className="text-muted-foreground max-w-160 mb-7 text-pretty text-[14px] leading-[1.7]">
          AI đã đề xuất các khái niệm cùng quan hệ tiên quyết. Đối chiếu từng khái niệm với trích
          đoạn gốc bên phải rồi mới xác nhận — bước này bắt buộc, hệ thống không tự động tin kết quả
          AI.
        </p>

        <ol className="bg-card border-border mb-6 flex overflow-hidden rounded-[calc(var(--radius)*0.9)] border">
          <li className="text-muted-foreground border-border flex min-w-0 flex-1 items-center gap-2.5 border-r px-4 py-3 text-[13px]">
            <span className="border-primary/40 bg-primary/10 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12.5l5.2 5.2L20 7" />
              </svg>
            </span>
            <span className="truncate">Nhập thông tin & tải tài liệu</span>
          </li>
          <li
            className={cn(
              'border-border flex min-w-0 flex-1 items-center gap-2.5 border-r px-4 py-3 text-[13px]',
              analysisDone ? 'text-muted-foreground' : 'text-foreground font-semibold'
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                analysisFailed
                  ? 'border-destructive/40 bg-destructive/10 text-destructive'
                  : 'border-primary/40 bg-primary/10 text-primary'
              )}
            >
              {analysisFailed ? (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : analysisRunning ? (
                <span className="border-primary/30 border-t-primary h-2.5 w-2.5 animate-spin rounded-full border-2" />
              ) : (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12.5l5.2 5.2L20 7" />
                </svg>
              )}
            </span>
            <span className="truncate">AI phân tích</span>
          </li>
          <li
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2.5 px-4 py-3 text-[13px]',
              analysisDone ? 'bg-accent text-foreground font-semibold' : 'text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]',
                analysisDone ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
              )}
            >
              3
            </span>
            <span className="truncate">Kiểm chứng & xác nhận</span>
          </li>
        </ol>

        <div className="h-150 flex flex-col gap-4">
          {plan?.dagAutoFixed && mode === 'edit' && (
            <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>
                Hệ thống đã tự động loại bỏ một số quan hệ gây vòng lặp để đảm bảo cấu trúc hợp lệ.
              </span>
            </div>
          )}
          <div className="min-h-0 flex-1">
            {isLoading ? (
              <div className="border-border bg-card flex h-full w-full items-center justify-center rounded-xl border">
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <span>
                    {analysisRunning ? 'Đang phân tích tài liệu...' : 'Đang tải đồ thị...'}
                  </span>
                </div>
              </div>
            ) : analysisFailed ? (
              <div className="border-border bg-card h-full w-full overflow-auto rounded-xl border p-6">
                <div className="max-w-160 mx-auto">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-destructive shrink-0" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5" />
                        <path d="M12 16.5h.01" />
                      </svg>
                    </span>
                    <span className="text-[15px] font-semibold">Phân tích tài liệu thất bại</span>
                  </div>
                  <p className="text-muted-foreground mb-4 text-pretty text-[13px] leading-[1.65]">
                    AI không trích xuất được khái niệm từ tài liệu đã tải lên. Tài liệu và kế hoạch
                    nháp vẫn còn nguyên — bạn có thể thử lại.
                  </p>
                  <Button variant="secondary" size="sm" onClick={handleRetry} disabled={isRetrying}>
                    {isRetrying ? 'Đang thử lại...' : 'Thử lại'}
                  </Button>
                </div>
              </div>
            ) : plan ? (
              <ConceptGraph
                initialConcepts={plan.graph.concepts}
                initialEdges={plan.graph.edges}
                mode={mode}
                onConfirm={handleConfirmGraph}
              />
            ) : (
              <div className="border-border bg-card text-muted-foreground flex h-full w-full items-center justify-center rounded-xl border">
                Không tìm thấy dữ liệu đồ thị.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------- VIEW MODE LAYOUT -----------------
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-6">
      <div className="mb-4 flex-none">
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-[13px]">
          <button
            onClick={() => navigate('/plans')}
            className="hover:text-foreground hover:border-border border-b border-transparent pb-px transition-colors"
          >
            Kế hoạch ôn tập
          </button>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span>{plan?.name || 'Chi tiết kế hoạch'}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight">
              {plan?.name || 'Loading...'}
            </h1>
            {plan?.deadline && (
              <p className="text-muted-foreground mt-1 text-sm">
                Deadline: {new Date(plan.deadline).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-muted/50 border-border rounded border px-2 py-1 text-sm">
              Status: <span className="font-mono font-medium">{plan?.status || '...'}</span>
            </div>
            {plan?.status !== 'completed' && (
              <Button variant="outline" size="sm" onClick={() => setSearchParams({ mode: 'edit' })}>
                Sửa Đồ Thị (Edit Mode)
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <div className="border-border bg-muted/20 flex h-full w-full items-center justify-center rounded-xl border">
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <span>Đang tải đồ thị...</span>
            </div>
          </div>
        ) : plan ? (
          <ConceptGraph
            initialConcepts={plan.graph.concepts}
            initialEdges={plan.graph.edges}
            mode={mode}
            onConfirm={undefined}
          />
        ) : (
          <div className="border-border bg-muted/20 text-muted-foreground flex h-full w-full items-center justify-center rounded-xl border">
            Không tìm thấy dữ liệu đồ thị.
          </div>
        )}
      </div>
    </div>
  );
}
