import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConceptLensButton } from '../components/ConceptLensButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Upload, CheckCircle2, ArrowRight, FileText, Network, Settings, Zap, Download, Table, X } from 'lucide-react';

interface UploadWizardProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, name: 'Upload Scores', icon: Upload },
  { id: 2, name: 'Concept Mapping', icon: Network },
  { id: 3, name: 'Configure Graph', icon: Settings },
  { id: 4, name: 'Compute', icon: Zap },
];

export const UploadWizard: React.FC<UploadWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep === 4) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onComplete();
      }, 3000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFileUpload = () => {
    setUploadedFile('exam_scores_spring2026.csv');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl text-foreground">Data Import Wizard</h1>
          <p className="text-foreground-secondary">
            Upload assessment data and configure conceptual analysis
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'border-[#FFCB05] bg-[#FFCB05]/10'
                      : 'border-border bg-surface'
                  }`}
                  animate={{
                    scale: currentStep === step.id ? 1.1 : 1,
                  }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5 text-[#FFCB05]" />
                  ) : (
                    <step.icon
                      className={`w-5 h-5 ${
                        currentStep >= step.id ? 'text-[#FFCB05]' : 'text-foreground-secondary'
                      }`}
                    />
                  )}
                </motion.div>
                <div>
                  <div className="text-xs text-foreground-secondary">Step {step.id}</div>
                  <div
                    className={`text-sm ${
                      currentStep >= step.id ? 'text-foreground' : 'text-foreground-secondary'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-border mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content area */}
        <div className="bg-white border border-border rounded-xl p-8 min-h-[500px] shadow-sm">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl text-foreground">Upload Assessment Scores</h2>
                    <p className="text-sm text-foreground-secondary mt-1">
                      Upload a CSV file with student IDs and concept-level scores (0-100)
                    </p>
                  </div>
                  <button className="text-sm text-[#00274C] hover:text-[#FFCB05] flex items-center gap-1 transition-colors">
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>

                <div
                  onClick={handleFileUpload}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-[#FFCB05] hover:bg-surface/50 transition-all group"
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFCB05]/10">
                        <FileText className="w-8 h-8 text-[#00274C]" />
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{uploadedFile}</div>
                        <div className="text-sm text-foreground-secondary mt-1">
                          1,247 rows • 12 concepts • Valid format
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-xs text-critical hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface group-hover:bg-[#FFCB05]/10 transition-colors">
                        <Upload className="w-8 h-8 text-foreground-secondary group-hover:text-[#00274C] transition-colors" />
                      </div>
                      <div>
                        <div className="text-foreground group-hover:text-[#00274C] transition-colors font-medium">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-sm text-foreground-secondary mt-1">
                          CSV, TSV up to 10MB
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {uploadedFile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FFCB05]/5 border border-[#FFCB05]/20 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#00274C] mt-0.5" />
                      <div className="space-y-2 flex-1">
                        <div className="text-sm text-foreground font-medium">File validated successfully</div>
                        <div className="text-xs text-foreground-secondary">
                          Expected format detected: Student ID column followed by 12 concept score columns
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-lg text-[#00274C] font-medium">1,247</div>
                            <div className="text-xs text-foreground-secondary">Students</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-lg text-[#00274C] font-medium">12</div>
                            <div className="text-xs text-foreground-secondary">Concepts</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-lg text-[#00274C] font-medium">0</div>
                            <div className="text-xs text-foreground-secondary">Errors</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sample data preview */}
                {uploadedFile && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Table className="w-4 h-4" />
                      Data Preview (first 3 rows)
                    </div>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-surface">
                          <tr>
                            <th className="px-3 py-2 text-left text-foreground-secondary font-medium">Student ID</th>
                            <th className="px-3 py-2 text-center text-foreground-secondary font-medium">Limits</th>
                            <th className="px-3 py-2 text-center text-foreground-secondary font-medium">Derivatives</th>
                            <th className="px-3 py-2 text-center text-foreground-secondary font-medium">Chain Rule</th>
                            <th className="px-3 py-2 text-center text-foreground-secondary font-medium">...</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">STU001234</td>
                            <td className="px-3 py-2 text-center text-foreground">85</td>
                            <td className="px-3 py-2 text-center text-foreground">72</td>
                            <td className="px-3 py-2 text-center text-foreground">68</td>
                            <td className="px-3 py-2 text-center text-foreground-secondary">...</td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">STU001235</td>
                            <td className="px-3 py-2 text-center text-foreground">92</td>
                            <td className="px-3 py-2 text-center text-foreground">88</td>
                            <td className="px-3 py-2 text-center text-foreground">84</td>
                            <td className="px-3 py-2 text-center text-foreground-secondary">...</td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">STU001236</td>
                            <td className="px-3 py-2 text-center text-foreground">76</td>
                            <td className="px-3 py-2 text-center text-foreground">64</td>
                            <td className="px-3 py-2 text-center text-foreground">58</td>
                            <td className="px-3 py-2 text-center text-foreground-secondary">...</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl text-foreground">Define Concept Dependencies</h2>
                <p className="text-sm text-foreground-secondary">
                  Specify prerequisite relationships between concepts
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {['Limits', 'Derivatives', 'Integration', 'Chain Rule', 'FTC', 'Series'].map((concept, idx) => (
                    <div key={idx} className="bg-surface border border-border rounded-lg p-4 space-y-3 hover:border-[#FFCB05]/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-foreground font-medium">{concept}</div>
                        <div className="text-xs text-[#00274C] bg-[#FFCB05]/10 px-2 py-1 rounded">
                          {idx > 0 ? Math.floor(Math.random() * 3) : 0} prerequisites
                        </div>
                      </div>
                      <div className="text-xs text-foreground-secondary">
                        {idx === 0 && 'Foundation concept - no prerequisites'}
                        {idx === 1 && 'Requires: Limits'}
                        {idx === 2 && 'Requires: Derivatives'}
                        {idx === 3 && 'Requires: Derivatives'}
                        {idx === 4 && 'Requires: Derivatives, Integration'}
                        {idx === 5 && 'Requires: Limits, Integration'}
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFCB05]" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FFCB05]/5 border border-[#FFCB05]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00274C]" />
                    <span className="text-sm text-foreground">12 concepts mapped with 18 dependencies</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl text-foreground">Configure Analysis Parameters</h2>
                <p className="text-sm text-foreground-secondary">
                  Set weights for readiness calculation algorithm
                </p>

                <div className="space-y-6">
                  <div className="space-y-3 bg-surface border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-foreground font-medium">Direct Mastery Weight (α)</label>
                      <span className="text-sm text-[#00274C] font-mono bg-[#FFCB05]/10 px-3 py-1 rounded-lg">0.60</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      defaultValue="0.6"
                      className="w-full accent-[#FFCB05]"
                    />
                    <p className="text-xs text-foreground-secondary">
                      Weight of student's direct performance on concept questions
                    </p>
                  </div>

                  <div className="space-y-3 bg-surface border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-foreground font-medium">Prerequisite Weight (β)</label>
                      <span className="text-sm text-[#00274C] font-mono bg-[#FFCB05]/10 px-3 py-1 rounded-lg">0.30</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      defaultValue="0.3"
                      className="w-full accent-[#FFCB05]"
                    />
                    <p className="text-xs text-foreground-secondary">
                      Penalty factor for weak prerequisite readiness
                    </p>
                  </div>

                  <div className="space-y-3 bg-surface border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-foreground font-medium">Readiness Threshold</label>
                      <span className="text-sm text-[#00274C] font-mono bg-[#FFCB05]/10 px-3 py-1 rounded-lg">0.50</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      defaultValue="0.5"
                      className="w-full accent-[#FFCB05]"
                    />
                    <p className="text-xs text-foreground-secondary">
                      Minimum readiness score for concept mastery
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 flex flex-col items-center justify-center min-h-[400px]"
              >
                {!isProcessing ? (
                  <>
                    <div className="w-20 h-20 rounded-2xl bg-[#FFCB05]/10 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-[#00274C]" />
                    </div>
                    <h2 className="text-xl text-foreground text-center">Ready to Compute</h2>
                    <p className="text-sm text-foreground-secondary text-center max-w-md">
                      All data validated. Click below to compute concept readiness scores
                      and generate intervention recommendations.
                    </p>
                    <div className="bg-surface border border-border rounded-xl p-6 space-y-4 w-full max-w-md">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary">Students</span>
                        <span className="text-foreground font-medium">1,247</span>
                      </div>
                      <div className="h-px bg-border"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary">Concepts</span>
                        <span className="text-foreground font-medium">12</span>
                      </div>
                      <div className="h-px bg-border"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary">Dependencies</span>
                        <span className="text-foreground font-medium">18</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <LoadingSpinner 
                      size={64} 
                      message="Computing readiness scores across dependency graph..."
                    />
                    <h2 className="text-xl text-foreground text-center">Processing 1,247 Students</h2>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <ConceptLensButton
            variant="subtle"
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1 || isProcessing}
          >
            Back
          </ConceptLensButton>

          <ConceptLensButton
            variant="primary"
            onClick={handleNext}
            disabled={isProcessing || (currentStep === 1 && !uploadedFile)}
            className="flex items-center gap-2"
          >
            {currentStep === 4 ? (isProcessing ? 'Computing...' : 'Compute & Continue') : 'Continue'}
            {!isProcessing && <ArrowRight className="w-4 h-4" />}
          </ConceptLensButton>
        </div>
      </div>
    </div>
  );
};
