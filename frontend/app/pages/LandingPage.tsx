import React from 'react';
import { motion } from 'motion/react';
import { ConceptLensButton } from '../components/ConceptLensButton';
import { Network, TrendingDown, Brain, Users, Target, LineChart, ArrowRight, Shield } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFCB05]/5 via-transparent to-[#00274C]/5" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#FFCB05] opacity-[0.10] blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-[28rem] h-[28rem] rounded-full bg-[#00274C] opacity-[0.08] blur-3xl"
          animate={{ scale: [1.15, 1, 1.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen px-4 py-20">
          <div className="w-full max-w-6xl space-y-20">
            {/* Hero Content */}
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00274C]/5 border border-[#00274C]/10 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-[#FFCB05] animate-pulse"></div>
                  AI-Powered Assessment Intelligence
                </div>
                
                <h1 className="text-6xl text-foreground leading-tight max-w-4xl mx-auto">
                  Transform Exam Data into<br />
                  <span className="relative inline-block">
                    <span className="text-[#00274C]">Actionable Insights</span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFCB05]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </span>
                </h1>
                
                <p className="text-lg text-foreground-secondary leading-relaxed max-w-xl mx-auto">
                  Upload exam scores, uncover prerequisite gaps, and get
                  AI-driven intervention strategies — all in one place.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex justify-center pt-4"
              >
                <ConceptLensButton 
                  variant="primary" 
                  type="button"
                  onClick={onStart}
                  className="px-8 py-3 text-lg group inline-flex items-center justify-center gap-3"
                >
                  Start Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </ConceptLensButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-8 justify-center pt-8 text-sm text-foreground-secondary"
              >
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#FFCB05]" />
                  Dependency-aware concept mapping
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FFCB05]" />
                  Institutional-grade security
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#FFCB05]" />
                  Root-cause intervention insights
                </div>
              </motion.div>
            </div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Feature 1 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFCB05]/10 flex items-center justify-center">
                  <Network className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Dependency Mapping</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    See how topics connect so you can quickly spot what students should learn first.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#00274C]/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Root-Cause Analysis</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    Understand why scores drop by tracing problems back to the concepts students missed.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFCB05]/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Concept Heatmaps</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    Get a clear visual snapshot of who is struggling and which topics need extra support.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFCB05]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Student Profiles</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    View easy-to-read student summaries with practical next-step recommendations.
                  </p>
                </div>
              </motion.div>

              {/* Feature 5 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#00274C]/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Intervention Alerts</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    Receive timely alerts when a student may need help, along with suggested actions.
                  </p>
                </div>
              </motion.div>

              {/* Feature 6 */}
              <motion.div 
                className="bg-white border border-border rounded-2xl p-6 space-y-4 hover:border-[#FFCB05] hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFCB05]/10 flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-[#00274C]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Longitudinal Tracking</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    Track progress over time to see what is improving and what still needs attention.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-8 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center">
              <a href="mailto:contact@prereq.ai" className="text-sm text-foreground-secondary hover:text-[#FFCB05] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
