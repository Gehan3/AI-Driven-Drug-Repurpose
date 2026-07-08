"use client"

import { useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { GraphNode as GraphNodeType, GraphEdge as GraphEdgeType } from "@/types"

const NODE_COLORS: Record<string, string> = {
  drug: "#DC2626",
  gene: "#16A34A",
  pathway: "#7C3AED",
  disease: "#2563EB",
}

const EDGE_COLORS: Record<string, string> = {
  binds: "#F97316",
  participates: "#7C3AED",
  associates: "#0891B2",
}

const NODE_ICONS: Record<string, string> = {
  drug: "\u{1F48A}",
  disease: "\u{1F3E5}",
  gene: "\u{1F9EC}",
  pathway: "\u{1F52C}",
}

function CustomNode({ data }: { data: any }) {
  const color = NODE_COLORS[data.nodeType] || "#64748B"
  return (
    <>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-400 !border-white" />
      <div
        className="px-4 py-2 rounded-lg shadow-md border-2 text-white text-xs font-medium whitespace-nowrap"
        style={{
          backgroundColor: color,
          borderColor: color + "80",
        }}
      >
        {NODE_ICONS[data.nodeType] && (
          <span className="mr-1.5">{NODE_ICONS[data.nodeType]}</span>
        )}
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-400 !border-white" />
    </>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

const LAYER_X: Record<string, number> = {
  drug: 0,
  gene: 250,
  pathway: 500,
  disease: 750,
}

function autoLayout(
  graphNodes: GraphNodeType[],
  graphEdges: GraphEdgeType[]
): { positions: Map<string, { x: number; y: number }>; error?: string } {
  const positions = new Map<string, { x: number; y: number }>()

  const byType: Record<string, GraphNodeType[]> = {}
  for (const n of graphNodes) {
    if (!byType[n.type]) byType[n.type] = []
    byType[n.type].push(n)
  }

  const yOffsets: Record<string, number> = {}
  for (const n of graphNodes) {
    const layer = LAYER_X[n.type] ?? 350
    const idx = yOffsets[n.type] ?? 0
    yOffsets[n.type] = idx + 1
    const spacing = n.type === "gene" ? 100 : 120
    const colCount = (byType[n.type] ?? []).length || 1
    const totalHeight = (colCount - 1) * spacing
    positions.set(n.id, {
      x: layer,
      y: idx * spacing - totalHeight / 2,
    })
  }

  return { positions }
}

interface Props {
  nodes?: GraphNodeType[]
  edges?: GraphEdgeType[]
  loading?: boolean
}

export function NetworkGraph({ nodes: graphNodes = [], edges: graphEdges = [], loading }: Props) {
  const hasData = graphNodes.length > 0 && graphEdges.length > 0

  const { positions } = useMemo(() => autoLayout(graphNodes, graphEdges), [graphNodes, graphEdges])

  const initialNodes: Node[] = useMemo(
    () =>
      graphNodes.map((n) => {
        const pos = positions.get(n.id) ?? { x: Math.random() * 600, y: Math.random() * 300 }
        return {
          id: n.id,
          type: "custom",
          position: { x: pos.x, y: pos.y },
          data: { label: n.label, nodeType: n.type },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        }
      }),
    [graphNodes, positions]
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      graphEdges.map((e, i) => {
        const color = EDGE_COLORS[e.type] || "#64748B"
        return {
          id: `e-${i}`,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          animated: true,
          style: { stroke: color, strokeWidth: 2, opacity: 0.6 },
          markerEnd: { type: MarkerType.ArrowClosed, color },
          label: `${(e.weight * 100).toFixed(0)}%`,
          labelStyle: { fontSize: 9, fill: "#64748B" },
        }
      }),
    [graphEdges]
  )

  if (!hasData && !loading) {
    return (
      <div className="w-full h-[400px] rounded-2xl border border-border/50 flex items-center justify-center text-muted text-sm">
        No pathway data available for this prediction
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-[400px] rounded-2xl border border-border/50 flex items-center justify-center text-muted text-sm">
        <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading pathway graph...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-border/50">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25, minZoom: 0.35, maxZoom: 1.2 }}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#E2E8F0" gap={20} size={1} />
          <Controls showInteractive={false} className="rounded-xl shadow-soft" />
        </ReactFlow>
      </div>

      <div className="grid gap-4 text-xs text-muted md:grid-cols-2">
        <div>
          <p className="mb-2 font-semibold text-foreground">Node Colors</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {[
              ["drug", "Drug / compound"],
              ["gene", "Gene target"],
              ["pathway", "Biological pathway"],
              ["disease", "Disease / indication"],
            ].map(([type, label]) => (
              <span key={type} className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: NODE_COLORS[type] }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-foreground">Edge Meaning</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {[
              ["binds", "Drug binds gene"],
              ["participates", "Gene participates in pathway"],
              ["associates", "Gene associates with disease"],
            ].map(([type, label]) => (
              <span key={type} className="inline-flex items-center gap-2">
                <span className="h-0.5 w-7 rounded-full" style={{ backgroundColor: EDGE_COLORS[type] }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
