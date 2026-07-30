import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConceptGraph } from '@/features/study-planner/components/ConceptGraph';
import { planApi } from '@/features/study-planner/api/plan.api';
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

  // Dùng ref để tránh vòng lặp vô hạn khi setSearchParams
  const hasAutoSwitchedToEdit = useRef(false);

  useEffect(() => {
    async function loadPlan() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await planApi.getPlan(id);
        setPlan(data);

        // Auto-switch draft plan sang edit mode (chỉ 1 lần duy nhất)
        if (data.status === 'draft' && rawMode !== 'edit' && !hasAutoSwitchedToEdit.current) {
          hasAutoSwitchedToEdit.current = true;
          setSearchParams({ mode: 'edit' }, { replace: true });
        }
      } catch (error) {
        console.error('Failed to load plan', error);
        toast.error('Không thể tải dữ liệu kế hoạch.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ re-fetch khi id thay đổi
  }, [id]);

  // Thêm try/catch cho handleConfirmGraph
  const handleConfirmGraph = async (concepts: Concept[], edges: ConceptEdge[]) => {
    if (!id) return;
    try {
      await planApi.updatePlanGraph(id, concepts, edges);
      // After confirming, switch to view mode
      setSearchParams({ mode: 'view' });
      // Update local state to reflect changes
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'active',
          graph: { concepts, edges },
        };
      });
    } catch (error) {
      console.error('Failed to update plan graph', error);
      toast.error('Không thể lưu đồ thị. Vui lòng thử lại.');
    }
  };


  // ----------------- EDIT MODE LAYOUT -----------------
  if (mode === 'edit') {
    return (
      <div className="mx-auto w-full max-w-5xl pb-12 pt-6 px-4">
        <div className="mb-4 flex items-center gap-2 text-[13px] text-muted-foreground">
          <button
            onClick={() => navigate('/plans')}
            className="hover:text-foreground hover:border-border border-b border-transparent pb-px transition-colors"
          >
            Kế hoạch ôn tập
          </button>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <span>Tạo mới · {plan?.name || 'Loading...'}</span>
        </div>

        <h1 className="font-heading mb-2 text-[30px] leading-tight tracking-tight">
          Kiểm chứng đồ thị khái niệm
        </h1>
        <p className="text-muted-foreground max-w-160 mb-7 text-[14px] leading-[1.7] text-pretty">
          AI đã đề xuất các khái niệm cùng quan hệ tiên quyết. Đối chiếu từng khái niệm với trích đoạn gốc bên phải rồi mới xác nhận — bước này bắt buộc, hệ thống không tự động tin kết quả AI.
        </p>

        <ol className="bg-card border-border mb-6 flex overflow-hidden rounded-[calc(var(--radius)*0.9)] border">
          <li className="text-muted-foreground border-border flex flex-1 items-center gap-2.5 border-r px-4 py-3 text-[13px] min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5.2 5.2L20 7" /></svg>
            </span>
            <span className="truncate">Nhập thông tin & tải tài liệu</span>
          </li>
          <li className="text-muted-foreground border-border flex flex-1 items-center gap-2.5 border-r px-4 py-3 text-[13px] min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5.2 5.2L20 7" /></svg>
            </span>
            <span className="truncate">AI phân tích</span>
          </li>
          <li className="bg-accent text-foreground flex flex-1 items-center gap-2.5 px-4 py-3 text-[13px] font-semibold min-w-0">
            <span className="bg-primary text-primary-foreground border-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]">3</span>
            <span className="truncate">Kiểm chứng & xác nhận</span>
          </li>
        </ol>

        <div className="h-150">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center border border-border rounded-xl bg-card">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span>Đang tải đồ thị...</span>
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
            <div className="w-full h-full flex items-center justify-center border border-border rounded-xl bg-card text-muted-foreground">
              Không tìm thấy dữ liệu đồ thị.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------- VIEW MODE LAYOUT -----------------
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6">
      <div className="flex-none mb-4">
        <div className="mb-2 flex items-center gap-2 text-[13px] text-muted-foreground">
          <button
            onClick={() => navigate('/plans')}
            className="hover:text-foreground hover:border-border border-b border-transparent pb-px transition-colors"
          >
            Kế hoạch ôn tập
          </button>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"
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
              <p className="text-muted-foreground text-sm mt-1">
                Deadline: {new Date(plan.deadline).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm px-2 py-1 rounded bg-muted/50 border border-border">
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

      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center border border-border rounded-xl bg-muted/20">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <div className="w-full h-full flex items-center justify-center border border-border rounded-xl bg-muted/20 text-muted-foreground">
            Không tìm thấy dữ liệu đồ thị.
          </div>
        )}
      </div>
    </div>
  );
}
