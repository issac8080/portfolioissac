"use client";

import { memo, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  MarkerType,
  Node,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import type { RetrievalSource } from "@/types/portfolioIntelligence";

function RetrievalFlowGraphInner({
  query,
  sources,
}: {
  query: string;
  sources: RetrievalSource[];
}) {
  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [
      {
        id: "q",
        data: { label: query.slice(0, 42) + (query.length > 42 ? "…" : "") },
        position: { x: 120, y: 0 },
        sourcePosition: Position.Bottom,
        style: {
          fontSize: 10,
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid rgba(0,212,255,0.45)",
          background: "rgba(10,20,30,0.95)",
          color: "#e0f2fe",
          width: 180,
          textAlign: "center" as const,
        },
      },
    ];
    const e: Edge[] = [];
    const top = sources.slice(0, 5);
    const radius = 95;
    const cx = 200;
    const cy = 115;
    top.forEach((s, i) => {
      const angle = (i / Math.max(top.length, 1)) * Math.PI * 1.25 + Math.PI * 0.15;
      const x = cx + Math.cos(angle) * radius - 70;
      const y = cy + Math.sin(angle) * radius - 18;
      const id = `c-${i}`;
      n.push({
        id,
        data: { label: `${s.source}\n${(s.score * 100).toFixed(0)}%` },
        position: { x, y },
        targetPosition: Position.Top,
        style: {
          fontSize: 9,
          padding: "6px 8px",
          borderRadius: 10,
          border: "1px solid rgba(0,255,136,0.25)",
          background: "rgba(15,25,20,0.92)",
          color: "#bbf7d0",
          width: 150,
          whiteSpace: "pre-wrap" as const,
        },
      });
      e.push({
        id: `e-${i}`,
        source: "q",
        target: id,
        animated: false,
        style: { stroke: "rgba(0,255,136,0.35)", strokeWidth: 1.2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(0,255,136,0.45)" },
      });
    });

    const cats = Array.from(new Set(top.map((t) => t.category)));
    cats.forEach((cat, j) => {
      const id = `cat-${j}`;
      n.push({
        id,
        data: { label: `Domain · ${cat}` },
        position: { x: 30 + j * 95, y: 210 },
        style: {
          fontSize: 9,
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid rgba(167,139,250,0.35)",
          background: "rgba(25,15,40,0.9)",
          color: "#ddd6fe",
        },
      });
      top.forEach((s, i) => {
        if (s.category !== cat) return;
        e.push({
          id: `ec-${i}-${j}`,
          source: `c-${i}`,
          target: id,
          animated: false,
          style: { stroke: "rgba(167,139,250,0.25)", strokeDasharray: "4 3" },
        });
      });
    });

    return { nodes: n, edges: e };
  }, [query, sources]);

  return (
    <div className="h-[min(200px,28vh)] w-full rounded-xl border border-white/10 bg-black/30 pi-retrieval-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={14} size={1} color="rgba(0,255,136,0.12)" />
      </ReactFlow>
    </div>
  );
}

export default memo(RetrievalFlowGraphInner);
