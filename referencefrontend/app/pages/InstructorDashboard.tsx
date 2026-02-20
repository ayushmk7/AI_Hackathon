import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConceptLensSlider } from '../components/ConceptLensSlider';
import { AlertPanel } from '../components/AlertPanel';
import { ConceptDAG } from '../components/ConceptDAG';
import { D3Heatmap } from '../components/D3Heatmap';
import { ChevronDown, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { concepts, alerts, defaultParameters, students } from '../data/mockData';
import type { ConceptNode } from '../data/mockData';

interface InstructorDashboardProps {
  onConceptClick: (concept: ConceptNode) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ onConceptClick }) => {
  const [parameters, setParameters] = useState(defaultParameters);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  const handleNodeClick = (node: ConceptNode) => {
    setSelectedConceptId(node.id);
    onConceptClick(node);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl text-foreground font-medium">Instructor Dashboard</h1>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-3">
              <select className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]">
                <option>MATH 2420 - Calculus II</option>
                <option>MATH 1410 - Calculus I</option>
                <option>MATH 3210 - Linear Algebra</option>
              </select>
              <select className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]">
                <option>Midterm Exam</option>
                <option>Final Exam</option>
                <option>Quiz 1</option>
              </select>
              <select className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]">
                <option>Spring 2026</option>
                <option>Fall 2025</option>
                <option>Spring 2025</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-border">
              <Users className="w-4 h-4 text-foreground-secondary" />
              <span className="text-sm text-foreground">1,247 students</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-border">
              <TrendingUp className="w-4 h-4 text-foreground-secondary" />
              <span className="text-sm text-foreground">12 concepts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Parameters section */}
        <motion.div
          className="bg-white border border-border rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg text-foreground">Analysis Parameters</h2>
            <button className="text-xs text-foreground-secondary hover:text-foreground flex items-center gap-1">
              Advanced Settings
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <ConceptLensSlider
              label="Direct Weight (α)"
              value={parameters.alpha}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => setParameters({ ...parameters, alpha: value })}
              description="Direct mastery weight"
            />
            <ConceptLensSlider
              label="Prerequisite Weight (β)"
              value={parameters.beta}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => setParameters({ ...parameters, beta: value })}
              description="Prerequisite penalty factor"
            />
            <ConceptLensSlider
              label="Downstream Weight (γ)"
              value={parameters.gamma}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => setParameters({ ...parameters, gamma: value })}
              description="Future concept boost"
            />
            <ConceptLensSlider
              label="Readiness Threshold"
              value={parameters.threshold}
              min={0}
              max={1}
              step={0.05}
              onChange={(value) => setParameters({ ...parameters, threshold: value })}
              description="Mastery cutoff score"
            />
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Heatmap - 2 columns */}
          <motion.div
            className="col-span-2 bg-white border border-border rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-foreground">Concept Readiness Matrix</h2>
                <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-primary/80"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-warning/80"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-critical/80"></div>
                    <span>Low</span>
                  </div>
                </div>
              </div>

              <D3Heatmap
                concepts={concepts}
                students={students}
                onConceptClick={handleNodeClick}
              />
            </div>
          </motion.div>

          {/* Alerts - 1 column */}
          <motion.div
            className="bg-white border border-border rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-critical" />
                <h2 className="text-lg text-foreground">Priority Interventions</h2>
              </div>

              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <AlertPanel
                    key={alert.id}
                    alert={alert}
                    onClick={() => {
                      const concept = concepts.find(c => c.id === alert.conceptId);
                      if (concept) handleNodeClick(concept);
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Concept DAG */}
        <motion.div
          className="bg-white border border-border rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-4">
            <h2 className="text-lg text-foreground">Dependency Graph</h2>
            <div className="h-[600px]">
              <ConceptDAG
                concepts={concepts}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedConceptId}
              />
            </div>
            <div className="text-xs text-foreground-secondary text-center pt-2">
              Click nodes to view root-cause trace • Nodes pulse when below threshold
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
