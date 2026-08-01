import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Handle,
  Position,
  NodeProps,
  Node,
  ReactFlowInstance,
  MarkerType,
  useStore,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ConceptNode as ConceptNodeChip, masteryBand } from '@/components/ui/concept-node';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { Concept, ConceptEdge } from '../types/concept';
import {
  getLayoutedElements,
  hasCycle,
  toReactFlowEdges,
  toReactFlowNodes,
} from '../utils/graphTransform';
import { formatRelativeDays } from '../utils/planDates';
import { ConceptDetailPanel, type RelatedConcept } from './ConceptDetailPanel';

/** Trên 50 node, UC-17 [E1] yêu cầu mặc định chỉ vẽ vùng quanh node chưa vững. */
const LARGE_GRAPH_THRESHOLD = 50;

type MasteryFilter = 'all' | 'strong' | 'learning' | 'weak' | 'untested';

// --- CUSTOM NODE --- (đặt tên GraphNode để không đụng `ConceptNode` của ui/)
function GraphNode({ data, selected }: NodeProps) {
  const isConnectable = useStore((s) => s.nodesConnectable);
  const [isHovered, setIsHovered] = useState(false);
  const score = data.mastery as number | null;
  // Tạm thời coi như luôn có nguồn (vì API chưa trả về excerpt) để tránh cờ đỏ toàn bộ.
  // Khi nào API support thì sẽ check dựa trên c.description.
  const difficulty = (data.difficulty as number | undefined) ?? null;
  const lastTestedAt = (data.lastTestedAt as string | null | undefined) ?? null;
  const isRemediating = Boolean(data.isRemediating);
  const dependentCount = (data.dependentCount as number | undefined) ?? 0;

  return (
    <div
      className={`node ${selected ? 'node--sel' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ConceptNodeChip
        band={masteryBand(score)}
        className={isRemediating ? 'is-remediating' : undefined}
        style={{ width: '136px', position: 'relative' }}
      >
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          // `invisible` (visibility:hidden), không phải `hidden` (display:none): react-flow đo
          // vị trí cạnh qua getBoundingClientRect() của chính Handle này — display:none làm nó
          // rời khỏi layout hoàn toàn, khiến MỌI cạnh ở view mode (isConnectable=false) sụp về
          // một điểm ngoài khung nhìn dù dữ liệu concept/edge vẫn đúng. invisible giữ handle
          // trong layout (đo được) mà vẫn không vẽ ra.
          className={`w-3.5! h-3.5! -left-2 opacity-20 transition-opacity hover:opacity-100 ${!isConnectable ? 'invisible' : ''}`}
        />

        <span>{data.label as string}</span>
        {score !== null && (
          <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.75, fontWeight: 600 }}>
            {Math.round(score * 100)}%
          </span>
        )}

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className={`w-3.5! h-3.5! -right-2 opacity-20 transition-opacity hover:opacity-100 ${!isConnectable ? 'invisible' : ''}`}
        />
      </ConceptNodeChip>

      <div className="node__diff">
        {difficulty !== null ? `độ khó ${difficulty}/5` : 'có nguồn'}
      </div>

      {/* DB-02 bước 3: hover tóm tắt nhanh — click mới mở panel đầy đủ (DB-06) */}
      {isHovered && (
        <div className="bg-card border-border pointer-events-none absolute -top-1.5 left-1/2 z-30 w-max max-w-60 -translate-x-1/2 -translate-y-full rounded-md border px-2.5 py-2 text-[12px] shadow-lg">
          <span className="font-medium">{data.label as string}</span>
          <span className="text-muted-foreground ml-2 font-mono text-[11px]">
            {score !== null ? score.toFixed(2) : '—'}
          </span>
          <div className="text-muted-foreground mt-0.5 whitespace-nowrap font-mono text-[10.5px]">
            {lastTestedAt
              ? `kiểm tra lần cuối ${formatRelativeDays(lastTestedAt)}`
              : 'chưa kiểm tra'}
            {` · ${dependentCount} khái niệm phụ thuộc`}
          </div>
        </div>
      )}
    </div>
  );
}
// -------------------

/** Chip lọc DB-05 — dùng chung cho 4 mức mastery + "Đang ôn lại". */
function FilterChip({
  active,
  disabled,
  color,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'border-border inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent',
        disabled && 'cursor-not-allowed opacity-45'
      )}
    >
      {color && (
        <i className="block h-2 w-2 shrink-0 rounded-[2px]" style={{ background: color }} />
      )}
      {children}
    </button>
  );
}

interface ConceptGraphProps {
  /** Cần cho ConceptDetailPanel (DB-06) và điều hướng sang FS-01/AE-01. */
  planId: string;
  initialConcepts: Concept[];
  initialEdges: ConceptEdge[];
  mode: 'view' | 'edit';
  onConfirm?: (concepts: Concept[], edges: ConceptEdge[]) => Promise<void>;
}

export function ConceptGraph({
  planId,
  initialConcepts,
  initialEdges,
  mode,
  onConfirm,
}: ConceptGraphProps) {
  const navigate = useNavigate();
  const nodeTypes = useMemo(() => ({ conceptNode: GraphNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Add Concept dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newConceptName, setNewConceptName] = useState('');

  // --- DB-05: lọc & tìm kiếm (chỉ có ý nghĩa ở mode='view') ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBand, setFilterBand] = useState<MasteryFilter>('all');
  const [filterRemediating, setFilterRemediating] = useState(false);
  const [showAllNodes, setShowAllNodes] = useState(false);

  // Kế hoạch mới (hoặc phân tích lại) → bỏ bộ lọc cũ, không mang lọc của kế hoạch trước sang.
  // Điều chỉnh state ngay trong lúc render (React's "adjusting state when a prop changes"
  // pattern, dùng useState để nhớ giá trị trước chứ không phải useRef — đọc/ghi `ref.current`
  // lúc render bị react-hooks/refs cấm) thay vì một effect riêng, để tránh cascading render
  // mà react-hooks/set-state-in-effect cảnh báo.
  const [prevGraph, setPrevGraph] = useState({ concepts: initialConcepts, edges: initialEdges });
  if (prevGraph.concepts !== initialConcepts || prevGraph.edges !== initialEdges) {
    setPrevGraph({ concepts: initialConcepts, edges: initialEdges });
    setSearchQuery('');
    setFilterBand('all');
    setFilterRemediating(false);
    setShowAllNodes(false);
    setSelectedNodeId(null);
  }

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const prerequisites = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter((e) => e.target === selectedNodeId)
      .map((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        return { edgeId: e.id, sourceName: (sourceNode?.data?.label as string) || e.source };
      });
  }, [edges, nodes, selectedNodeId]);

  // DB-06: tiên quyết/hậu kế cho panel chi tiết — tính từ đồ thị client đã có sẵn (xem lý do
  // trong ConceptDetailResponse phía server), giữ tên/điểm số khớp với canvas.
  const prerequisitesForDetail = useMemo<RelatedConcept[]>(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter((e) => e.target === selectedNodeId)
      .flatMap((e) => {
        const n = nodeById.get(e.source);
        if (!n) return [];
        return [
          {
            id: n.id,
            name: n.data.label as string,
            masteryScore: (n.data.mastery as number | null) ?? null,
            isRemediating: Boolean(n.data.isRemediating),
          },
        ];
      });
  }, [edges, selectedNodeId, nodeById]);

  const dependentsForDetail = useMemo<RelatedConcept[]>(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter((e) => e.source === selectedNodeId)
      .flatMap((e) => {
        const n = nodeById.get(e.target);
        if (!n) return [];
        return [
          {
            id: n.id,
            name: n.data.label as string,
            masteryScore: (n.data.mastery as number | null) ?? null,
            isRemediating: Boolean(n.data.isRemediating),
          },
        ];
      });
  }, [edges, selectedNodeId, nodeById]);

  // Resolve selected edge info for delete bar
  const selectedEdgeInfo = useMemo(() => {
    if (!selectedEdgeId) return null;
    const edge = edges.find((e) => e.id === selectedEdgeId);
    if (!edge) return null;
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    return {
      id: edge.id,
      sourceName: (sourceNode?.data?.label as string) || edge.source,
      targetName: (targetNode?.data?.label as string) || edge.target,
    };
  }, [selectedEdgeId, edges, nodes]);

  // --- DB-05 derived state ---
  const weakCount = useMemo(
    () => initialConcepts.filter((c) => masteryBand(c.mastery_score) === 'weak').length,
    [initialConcepts]
  );
  const untestedCount = useMemo(
    () => initialConcepts.filter((c) => c.mastery_score === null).length,
    [initialConcepts]
  );
  // UC-17 [E2]: chưa có phiên kiểm tra nào — lọc theo một cột toàn null là thao tác rỗng.
  const allUntested = initialConcepts.length > 0 && untestedCount === initialConcepts.length;

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilter =
    mode === 'view' &&
    !allUntested &&
    (trimmedQuery !== '' || filterBand !== 'all' || filterRemediating);

  const matchedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    nodes.forEach((n) => {
      const label = String(n.data.label ?? '').toLowerCase();
      const band = masteryBand((n.data.mastery as number | null) ?? null);
      const remediating = Boolean(n.data.isRemediating);
      if (trimmedQuery && !label.includes(trimmedQuery)) return;
      if (filterBand !== 'all' && band !== filterBand) return;
      if (filterRemediating && !remediating) return;
      ids.add(n.id);
    });
    return ids;
  }, [nodes, trimmedQuery, filterBand, filterRemediating]);

  const noMatches = hasActiveFilter && nodes.length > 0 && matchedNodeIds.size === 0;

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterBand('all');
    setFilterRemediating(false);
  }, []);

  // UC-17 [E1]: > 50 node — mặc định chỉ vẽ node yếu + tiên quyết trực tiếp của chúng.
  const isLargeGraph = mode === 'view' && initialConcepts.length > LARGE_GRAPH_THRESHOLD;

  const largeGraphSubset = useMemo(() => {
    if (!isLargeGraph) return null;
    const weakIds = new Set(
      nodes
        .filter((n) => masteryBand((n.data.mastery as number | null) ?? null) === 'weak')
        .map((n) => n.id)
    );
    const result = new Set(weakIds);
    edges.forEach((e) => {
      if (weakIds.has(e.target)) result.add(e.source);
    });
    return result;
  }, [isLargeGraph, nodes, edges]);

  const dependentCounts = useMemo(() => {
    const map = new Map<string, number>();
    edges.forEach((e) => map.set(e.source, (map.get(e.source) ?? 0) + 1));
    return map;
  }, [edges]);

  // Khái niệm gốc (không có tiên quyết) — điểm bắt đầu tự nhiên khi chưa đo được gì (UC-17 [E2]).
  const rootConceptIds = useMemo(() => {
    if (!allUntested) return [];
    const withPrereq = new Set(edges.map((e) => e.target));
    return nodes.filter((n) => !withPrereq.has(n.id)).map((n) => n.id);
  }, [allUntested, nodes, edges]);

  const showLargeGraphSubset = isLargeGraph && !showAllNodes && largeGraphSubset !== null;

  const displayNodes = useMemo(() => {
    const base = showLargeGraphSubset ? nodes.filter((n) => largeGraphSubset!.has(n.id)) : nodes;
    return base.map((n) => {
      const dimmed = hasActiveFilter && !matchedNodeIds.has(n.id);
      return {
        ...n,
        data: { ...n.data, dependentCount: dependentCounts.get(n.id) ?? 0 },
        className: dimmed ? 'is-dimmed' : undefined,
      };
    });
  }, [
    showLargeGraphSubset,
    nodes,
    largeGraphSubset,
    hasActiveFilter,
    matchedNodeIds,
    dependentCounts,
  ]);

  const displayEdges = useMemo(() => {
    const base = showLargeGraphSubset
      ? edges.filter((e) => largeGraphSubset!.has(e.source) && largeGraphSubset!.has(e.target))
      : edges;
    return base.map((e) => {
      const dimmed =
        hasActiveFilter && (!matchedNodeIds.has(e.source) || !matchedNodeIds.has(e.target));
      let relClass = '';
      if (
        mode === 'view' &&
        selectedNodeId &&
        (e.source === selectedNodeId || e.target === selectedNodeId)
      ) {
        const isPrereqEdge = e.target === selectedNodeId;
        const sourceBand = masteryBand(
          (nodeById.get(e.source)?.data.mastery as number | null) ?? null
        );
        relClass =
          isPrereqEdge && sourceBand === 'weak'
            ? 'react-flow__edge--prerequisite-weak'
            : 'react-flow__edge--related';
      }
      return {
        ...e,
        className: [e.className, dimmed ? 'is-dimmed' : '', relClass].filter(Boolean).join(' '),
      };
    });
  }, [
    showLargeGraphSubset,
    edges,
    largeGraphSubset,
    hasActiveFilter,
    matchedNodeIds,
    mode,
    selectedNodeId,
    nodeById,
  ]);

  // Initialize and Layout
  useEffect(() => {
    const rfNodes = toReactFlowNodes(initialConcepts);
    const rfEdges = toReactFlowEdges(initialEdges);

    // Apply dagre layout (LR direction)
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rfNodes,
      rfEdges,
      'LR'
    );

    setNodes(layoutedNodes as Node[]);
    setEdges(layoutedEdges);
  }, [initialConcepts, initialEdges, setNodes, setEdges]);

  // Fit view to show entire graph when side panel toggles hoặc khi bật/tắt "Hiện toàn bộ"
  useEffect(() => {
    if (rfInstance && nodes.length > 0) {
      // Wait briefly for the side panel to render and CSS flex layout to resize
      setTimeout(() => {
        rfInstance.fitView({ duration: 600, padding: 0.2 });
      }, 50);
    }
  }, [selectedNodeId, rfInstance, nodes.length, showAllNodes]);

  // Handle new connections (Edit Mode)
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (mode !== 'edit') return;

      const newEdge = {
        id: `e_${Date.now()}`,
        type: 'straight',
        animated: false,
        className: 'concept-edge',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: 'var(--mastery-untested)',
        },
        source: params.source,
        target: params.target,
      } as Edge;

      const potentialEdges = [...edges, newEdge];

      if (hasCycle(nodes, potentialEdges)) {
        toast.error('Adding this edge would create a cycle (Vòng lặp). Cạnh đã bị từ chối.');
        return;
      }
      setEdges((eds) => addEdge(newEdge, eds) as Edge[]);
    },
    [mode, edges, nodes, setEdges]
  );

  // Auto Layout action
  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'LR');
    setNodes(layoutedNodes as Node[]);
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setIsUpdating(true);
    try {
      const concepts: Concept[] = nodes.map((n) => ({
        id: n.id,
        name: n.data.label as string,
        description: (n.data.description as string) || undefined,
        mastery_score: n.data.mastery as number | null,
      }));
      const conceptEdges: ConceptEdge[] = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
      }));

      await onConfirm(concepts, conceptEdges);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu đồ thị.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      toast.info('Đã xóa quan hệ tiên quyết.');
    },
    [setEdges]
  );

  // --- ADD CONCEPT ---
  const handleAddConcept = useCallback(() => {
    const name = newConceptName.trim();
    if (!name) {
      toast.warning('Vui lòng nhập tên khái niệm.');
      return;
    }

    // Check duplicate name
    const isDuplicate = nodes.some(
      (n) => (n.data.label as string).toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      toast.warning('Khái niệm này đã tồn tại.');
      return;
    }

    const newId = `c_${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'conceptNode',
      data: { label: name, mastery: null, description: '' },
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewConceptName('');
    setIsAddDialogOpen(false);
    toast.success(`Đã thêm khái niệm "${name}".`);
  }, [newConceptName, nodes, setNodes]);

  // --- DELETE NODE ---
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      // Also remove all edges connected to this node
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
      toast.info('Đã xóa khái niệm.');
    },
    [setNodes, setEdges]
  );

  return (
    <div
      className={`min-h-150 border-border bg-card flex h-full w-full flex-row overflow-hidden rounded-[calc(var(--radius)*1.2)] border`}
    >
      <div className="border-border relative flex min-w-0 flex-1 flex-col border-r">
        {mode === 'edit' && (
          <div className="py-2.75 border-border text-muted-foreground bg-card/80 z-10 flex items-center justify-between gap-3 border-b px-4 text-[12px] backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M13 2l-2 12h4l-2 8" />
              </svg>
              <span>Kéo thả để nối quan hệ. Chọn khái niệm để xem nguồn.</span>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-7 text-xs">
                    + Thêm khái niệm
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                  <DialogHeader>
                    <DialogTitle>Thêm khái niệm mới</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      autoFocus
                      placeholder="Nhập tên khái niệm..."
                      value={newConceptName}
                      onChange={(e) => setNewConceptName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddConcept()}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleAddConcept}>Thêm khái niệm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={onLayout}>
                Auto Layout
              </Button>
              <Button
                size="sm"
                className="h-7 px-4 text-xs"
                onClick={handleConfirm}
                disabled={isUpdating}
              >
                {isUpdating ? 'Đang lưu...' : 'Xác nhận & Bắt đầu'}
              </Button>
            </div>
          </div>
        )}

        {/* DB-05: thanh công cụ lọc & tìm kiếm */}
        {mode === 'view' && (
          <div className="border-border bg-card/80 z-10 flex flex-wrap items-center gap-2.5 border-b px-4 py-2.5 backdrop-blur-sm">
            <div className="relative w-56 shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.6-3.6" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm khái niệm theo tên..."
                aria-label="Tìm khái niệm"
                className="border-border bg-background text-foreground focus-visible:ring-ring py-1.75 w-full rounded-md border pl-8 pr-3 text-[13px] outline-none focus-visible:ring-2"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip
                active={filterBand === 'all'}
                disabled={allUntested}
                onClick={() => setFilterBand('all')}
              >
                Tất cả
              </FilterChip>
              <FilterChip
                active={filterBand === 'strong'}
                disabled={allUntested}
                color="var(--mastery-strong)"
                onClick={() => setFilterBand('strong')}
              >
                Vững
              </FilterChip>
              <FilterChip
                active={filterBand === 'learning'}
                disabled={allUntested}
                color="var(--mastery-learning)"
                onClick={() => setFilterBand('learning')}
              >
                Đang học
              </FilterChip>
              <FilterChip
                active={filterBand === 'weak'}
                disabled={allUntested}
                color="var(--mastery-weak)"
                onClick={() => setFilterBand('weak')}
              >
                Yếu
              </FilterChip>
              <FilterChip
                active={filterBand === 'untested'}
                disabled={allUntested}
                color="var(--mastery-untested)"
                onClick={() => setFilterBand('untested')}
              >
                Chưa kiểm tra
              </FilterChip>
              {/* "Đang ôn lại" đứng sau vạch ngăn — không cùng trục với 4 mức mastery ở trên:
                  bốn cái đó loại trừ nhau, cái này chồng lên bất kỳ cái nào. */}
              <span className="bg-border mx-0.5 h-5 w-px shrink-0" />
              <FilterChip
                active={filterRemediating}
                color="var(--remediate)"
                onClick={() => setFilterRemediating((v) => !v)}
              >
                Đang ôn lại
              </FilterChip>
            </div>
            <span className="text-muted-foreground ml-auto shrink-0 font-mono text-[12px] tabular-nums">
              {hasActiveFilter
                ? `${matchedNodeIds.size} / ${initialConcepts.length} khái niệm`
                : `${initialConcepts.length} khái niệm · ${weakCount} yếu · ${untestedCount} chưa kiểm tra`}
            </span>
          </div>
        )}

        {/* UC-17 [E1]: cảnh báo + lối giải quyết cho đồ thị lớn */}
        {showLargeGraphSubset && (
          <div className="bg-mastery-learning/7 border-border flex flex-wrap items-center gap-3 border-b px-4 py-2.5 text-[12.5px]">
            <span>
              <strong>{initialConcepts.length} khái niệm</strong> — đang hiển thị{' '}
              {largeGraphSubset?.size ?? 0} khái niệm chưa vững và tiên quyết trực tiếp của chúng.
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto h-7 shrink-0 text-xs"
              onClick={() => setShowAllNodes(true)}
            >
              Hiện toàn bộ {initialConcepts.length} node
            </Button>
          </div>
        )}

        <div
          className="bg-muted/30 relative flex-1"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, oklch(from var(--foreground) l c h / 0.06) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        >
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            nodeTypes={nodeTypes}
            // Luôn nối onNodesChange/onEdgesChange — react-flow báo kích thước node đo được
            // (dimension change) qua chính handler này; không nối ở view mode khiến node
            // không bao giờ có `measured.width/height`, và cạnh (tính theo tâm handle) sụp
            // về một điểm ngoài khung nhìn. Kéo/nối/xoá vẫn chỉ bật ở edit mode, qua
            // nodesDraggable/nodesConnectable/deleteKeyCode bên dưới, không qua đây.
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onSelectionChange={(params) => {
              if (params.nodes.length > 0) {
                setSelectedNodeId(params.nodes[0].id);
                setSelectedEdgeId(null);
              } else {
                setSelectedNodeId(null);
              }
            }}
            onEdgeClick={
              mode === 'edit'
                ? (_event, edge) => {
                    setSelectedEdgeId(edge.id);
                    setSelectedNodeId(null);
                  }
                : undefined
            }
            onPaneClick={() => {
              if (mode === 'edit') {
                setSelectedEdgeId(null);
              }
            }}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodesDraggable={mode === 'edit'}
            nodesConnectable={mode === 'edit'}
            elementsSelectable
            deleteKeyCode={mode === 'edit' ? ['Backspace', 'Delete'] : null}
            fitView
          >
            <Background gap={22} color="transparent" />
            <Controls />
          </ReactFlow>

          {/* Edge delete floating bar */}
          {mode === 'edit' && selectedEdgeInfo && (
            <div className="bg-card/95 border-border animate-in fade-in slide-in-from-bottom-2 absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-2.5 text-[13px] shadow-lg backdrop-blur-md duration-200">
              <span className="text-muted-foreground">
                Quan hệ:{' '}
                <span className="text-foreground font-medium">{selectedEdgeInfo.sourceName}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-1.5 inline opacity-50"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
                <span className="text-foreground font-medium">{selectedEdgeInfo.targetName}</span>
              </span>
              <button
                type="button"
                className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 rounded-md border px-3 py-1 text-[12px] font-medium transition-colors"
                onClick={() => {
                  handleRemoveEdge(selectedEdgeInfo.id);
                  setSelectedEdgeId(null);
                }}
              >
                Xóa
              </button>
            </div>
          )}

          {nodes.length === 0 && !isUpdating && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground bg-card/80 border-border rounded-lg border px-4 py-2 text-sm backdrop-blur-sm">
                {mode === 'edit'
                  ? 'Đồ thị trống — nhấn "+ Thêm khái niệm" để bắt đầu.'
                  : 'Chưa có khái niệm nào trong đồ thị.'}
              </p>
            </div>
          )}

          {/* DB-02 Alt flow 1: lọc/tìm kiếm không khớp gì — làm mờ toàn bộ + lối ra */}
          {noMatches && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 px-6 text-center">
              <p className="text-[14px] font-semibold">Không có khái niệm phù hợp</p>
              <p className="text-muted-foreground max-w-100 text-pretty text-[12.5px] leading-[1.65]">
                Không có khái niệm nào khớp với bộ lọc hiện tại. Xóa bộ lọc để xem lại toàn bộ đồ
                thị.
              </p>
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* UC-17 [E2]: chưa có phiên kiểm tra nào — gợi ý điểm bắt đầu tự nhiên */}
          {mode === 'view' && allUntested && rootConceptIds.length > 0 && (
            <div className="border-border bg-card/95 w-70 absolute left-4 top-4 z-10 rounded-lg border p-4 shadow-md backdrop-blur-sm">
              <p className="mb-1.5 text-[13px] font-semibold">Chưa đo được gì</p>
              <p className="text-muted-foreground mb-3 text-pretty text-[12px] leading-[1.65]">
                Đồ thị đã dựng xong nhưng chưa biết bạn vững ở đâu. {rootConceptIds.length} khái
                niệm không có tiên quyết nào là điểm bắt đầu tự nhiên.
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/interview?planId=${planId}&conceptIds=${rootConceptIds.join(',')}`)
                }
              >
                Kiểm tra {rootConceptIds.length} khái niệm gốc
              </Button>
            </div>
          )}

          {/* Chú giải cạnh — đồ thị có ba kiểu cạnh, chỉ hiện ở view mode khi có node được chọn */}
          {mode === 'view' && selectedNodeId && (
            <div className="border-border bg-card absolute bottom-4 left-4 z-10 flex flex-wrap gap-4 rounded-lg border px-3.5 py-2 text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <svg width="22" height="8" aria-hidden="true">
                  <line x1="0" y1="4" x2="22" y2="4" stroke="var(--foreground)" strokeWidth="2" />
                </svg>
                Liên quan tới khái niệm đang chọn
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5">
                <svg width="22" height="8" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="22"
                    y2="4"
                    stroke="var(--mastery-weak)"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </svg>
                Tiên quyết còn yếu
              </span>
            </div>
          )}
        </div>
      </div>

      {mode === 'edit' && selectedNode && (
        <aside className="w-70 border-border bg-card absolute bottom-0 right-0 top-0 z-10 flex shrink-0 flex-col gap-4 overflow-y-auto border-l p-[18px_18px_20px] shadow-lg lg:static lg:w-80 lg:border-none lg:shadow-none">
          <div>
            <p className="text-muted-foreground mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.07em]">
              Khái niệm đang chọn
            </p>
            <h2 className="font-heading mb-2 text-[19px] leading-tight tracking-[-0.015em]">
              {selectedNode.data.label as string}
            </h2>
            {(() => {
              const diff = (selectedNode.data.difficulty as number | undefined) ?? null;
              if (diff === null) return null;
              return (
                <div className="text-muted-foreground flex items-center gap-1.5 text-[12px]">
                  <span className="gap-0.75 flex" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`h-1 w-3.5 rounded-sm ${i < diff ? 'bg-muted-foreground' : 'bg-border'}`}
                      />
                    ))}
                  </span>
                  <span>độ khó {diff}/5 — AI ước lượng</span>
                </div>
              );
            })()}
          </div>

          <div className="bg-border my-1 h-px"></div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold">Trích từ tài liệu</span>
            </div>
            {selectedNode.data.description ? (
              <blockquote className="text-muted-foreground border-border m-0 mb-3 text-pretty border-l-[3px] py-0.5 pl-3.5 text-[13.5px] leading-[1.65]">
                {selectedNode.data.description as string}
              </blockquote>
            ) : (
              <p className="text-muted-foreground mb-3 text-[13px] italic">
                Không có trích đoạn gốc.
              </p>
            )}
            <div className="flex gap-4">
              <button
                type="button"
                className="text-destructive decoration-destructive/30 text-[12.5px] font-medium decoration-2 underline-offset-4 hover:underline"
                onClick={() => handleDeleteNode(selectedNode.id)}
              >
                Sai — bỏ khái niệm
              </button>
            </div>
          </div>

          <div className="bg-border my-1 h-px"></div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold">Tiên quyết</span>
              <span className="text-muted-foreground font-mono text-[12px]">
                {prerequisites.length} quan hệ
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {prerequisites.length > 0 ? (
                prerequisites.map((req) => (
                  <div
                    key={req.edgeId}
                    className="bg-muted/40 border-border/50 flex items-center justify-between rounded-md border px-3 py-2 text-[13px]"
                  >
                    <span className="mr-2 truncate">{req.sourceName}</span>
                    <button
                      className="opacity-50 transition-opacity hover:opacity-100"
                      type="button"
                      onClick={() => handleRemoveEdge(req.edgeId)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-[13px] italic">Không có tiên quyết</p>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* DB-06: panel chi tiết — chỉ ở view mode, thay cho aside rút gọn của edit mode */}
      {mode === 'view' && selectedNode && (
        <ConceptDetailPanel
          // Remount per concept — its internal fetch state (`isLoading`/`hasError`/`detail`)
          // then starts fresh by construction, no reset-on-prop-change effect needed.
          key={selectedNode.id}
          planId={planId}
          conceptId={selectedNode.id}
          conceptName={selectedNode.data.label as string}
          prerequisites={prerequisitesForDetail}
          dependents={dependentsForDetail}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
