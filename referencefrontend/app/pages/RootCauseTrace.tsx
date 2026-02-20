import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConceptLensButton } from '../components/ConceptLensButton';
import { WaterfallChart } from '../components/WaterfallChart';
import { ArrowLeft, ChevronDown, Info } from 'lucide-react';
import type { ConceptNode } from '../data/mockData';
import { concepts, getWaterfallData } from '../data/mockData';

interface RootCauseTraceProps {
  concept: ConceptNode;
  onBack: () => void;
}

export const RootCauseTrace: React.FC<RootCauseTraceProps> = ({ concept, onBack }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const waterfallData = getWaterfallData(concept.id);

  const prerequisites = concept.prerequisites
    .map(id => concepts.find(c => c.id === id))
    .filter(Boolean) as ConceptNode[];

  const getColor = (readiness: number) => {
    if (readiness >= 0.7) return '#FFCB05';
    if (readiness >= 0.5) return '#F5B942';
    return '#E05A5A';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ConceptLensButton variant="subtle" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </ConceptLensButton>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl text-foreground font-medium">Root-Cause Analysis</h1>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {/* Left side - Concept chain */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Selected concept card */}
              <div className="bg-white border-2 border-[#FFCB05] rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs text-foreground-secondary uppercase tracking-wide mb-1">
                      Selected Concept
                    </div>
                    <h2 className="text-2xl text-foreground">{concept.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground-secondary mb-1">Readiness</div>
                    <div className="text-3xl" style={{ color: getColor(concept.readiness) }}>
                      {Math.round(concept.readiness * 100)}%
                    </div>
                  </div>
                </div>

                <div className="h-2 bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getColor(concept.readiness) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${concept.readiness * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Prerequisite chain */}
              {prerequisites.length > 0 && (
                <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg text-foreground mb-4">Prerequisite Chain</h3>
                  <div className="space-y-4">
                    {prerequisites.map((prereq, idx) => (
                      <motion.div
                        key={prereq.id}
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {/* Connecting line */}
                        {idx < prerequisites.length - 1 && (
                          <div className="absolute left-6 top-full h-4 w-px bg-border"></div>
                        )}

                        <div className="flex items-center gap-4">
                          {/* Node indicator */}
                          <div
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: getColor(prereq.readiness) }}
                          >
                            <span
                              className="text-sm font-mono"
                              style={{ color: getColor(prereq.readiness) }}
                            >
                              {Math.round(prereq.readiness * 100)}%
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="text-sm text-foreground">{prereq.name}</div>
                            <div className="text-xs text-foreground-secondary">
                              Depth {prereq.depth} • {prereq.prerequisites.length} prerequisites
                            </div>
                          </div>

                          {/* Impact indicator */}
                          <div className="text-xs text-foreground-secondary">
                            {prereq.readiness < 0.5 ? 'Critical gap' : prereq.readiness < 0.7 ? 'Weak' : 'Strong'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual dependency graph */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg text-foreground mb-4">Upstream Dependencies</h3>
                <div className="flex items-center justify-center h-64 bg-surface rounded-lg">
                  <svg width="100%" height="100%" viewBox="0 0 400 250">
                    {/* Simple tree visualization */}
                    {prerequisites.map((prereq, idx) => {
                      const x = 200;
                      const y = 50 + idx * 60;
                      return (
                        <g key={prereq.id}>
                          <line
                            x1={x}
                            y1={y}
                            x2={200}
                            y2={220}
                            stroke="#DEE2E6"
                            strokeWidth="2"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="20"
                            fill="#FFFFFF"
                            stroke={getColor(prereq.readiness)}
                            strokeWidth="2.5"
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            fill={getColor(prereq.readiness)}
                            fontSize="11"
                            fontWeight="600"
                          >
                            {Math.round(prereq.readiness * 100)}%
                          </text>
                        </g>
                      );
                    })}
                    {/* Target concept */}
                    <circle
                      cx="200"
                      cy="220"
                      r="24"
                      fill="#FFFFFF"
                      stroke={getColor(concept.readiness)}
                      strokeWidth="3"
                    />
                    <text
                      x="200"
                      y="226"
                      textAnchor="middle"
                      fill={getColor(concept.readiness)}
                      fontSize="12"
                      fontWeight="600"
                    >
                      {Math.round(concept.readiness * 100)}%
                    </text>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Right side - Waterfall breakdown */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg text-foreground mb-4">Readiness Calculation Breakdown</h3>
                <WaterfallChart data={waterfallData} />
              </div>

              {/* Formula explanation */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <h3 className="text-lg text-foreground group-hover:text-primary transition-colors">
                      Calculation Formula
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-foreground-secondary transition-transform ${
                      showExplanation ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-3"
                  >
                    <div className="bg-elevated rounded-lg p-4 font-mono text-sm text-foreground">
                      R = α × Direct + β × PrereqAvg + γ × DownstreamBoost
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-primary">α = 0.6</span>
                        <span className="text-foreground-secondary">Direct mastery weight</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">β = 0.3</span>
                        <span className="text-foreground-secondary">Prerequisite penalty factor</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">γ = 0.1</span>
                        <span className="text-foreground-secondary">Downstream boost weight</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-foreground-secondary leading-relaxed">
                        Readiness is computed as a weighted combination of direct question performance,
                        averaged prerequisite readiness, and potential boost from strong downstream
                        concept understanding. Weak prerequisites create a penalty that reduces overall
                        readiness even when direct scores are high.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Intervention recommendations */}
              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg text-foreground mb-4">Recommended Interventions</h3>
                <div className="space-y-3">
                  <div className="bg-critical/5 border border-critical/20 rounded-lg p-4">
                    <div className="text-sm text-foreground mb-1">High Priority</div>
                    <div className="text-xs text-foreground-secondary leading-relaxed">
                      Review prerequisite concepts with affected students in small group sessions
                    </div>
                  </div>
                  <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                    <div className="text-sm text-foreground mb-1">Medium Priority</div>
                    <div className="text-xs text-foreground-secondary leading-relaxed">
                      Assign targeted practice problems focusing on weak prerequisite areas
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="text-sm text-foreground mb-1">Supplementary</div>
                    <div className="text-xs text-foreground-secondary leading-relaxed">
                      Provide video resources explaining prerequisite connections
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
