import React, { useState } from 'react';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import type { ConceptNode } from '../data/mockData';

interface ConceptDAGProps {
  concepts: ConceptNode[];
  onNodeClick?: (node: ConceptNode) => void;
  selectedNodeId?: string | null;
}

export const ConceptDAG: React.FC<ConceptDAGProps> = ({ 
  concepts, 
  onNodeClick,
  selectedNodeId 
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const getEdges = () => {
    const edges: Array<{ from: ConceptNode; to: ConceptNode }> = [];
    concepts.forEach(concept => {
      concept.prerequisites.forEach(preId => {
        const prerequisite = concepts.find(c => c.id === preId);
        if (prerequisite) {
          edges.push({ from: prerequisite, to: concept });
        }
      });
    });
    return edges;
  };

  const edges = getEdges();

  const isEdgeActive = (edge: { from: ConceptNode; to: ConceptNode }) => {
    if (!selectedNodeId) return false;
    return edge.to.id === selectedNodeId || edge.from.id === selectedNodeId;
  };

  return (
    <div className="w-full h-full bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      <svg width="100%" height="100%" viewBox="0 0 800 600" className="w-full h-full">
        {/* Grid pattern background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F8F9FA" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Edges */}
        <g>
          {edges.map((edge, idx) => (
            <GraphEdge
              key={`edge-${idx}`}
              from={edge.from}
              to={edge.to}
              isActive={isEdgeActive(edge)}
              weight={1}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {concepts.map(node => (
            <GraphNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id || hoveredNodeId === node.id}
              onClick={() => {
                if (onNodeClick) onNodeClick(node);
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
