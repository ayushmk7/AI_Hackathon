import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { BookOpen, TrendingUp, Target, ChevronRight, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { concepts, students, getStudyPlan } from '../data/mockData';
import { StudentConceptGraph } from '../components/StudentConceptGraph';

const mockStudents = [
  { id: 's1', name: 'Emma Johnson', email: 'emma.j@umich.edu' },
  { id: 's2', name: 'Michael Chen', email: 'mchen@umich.edu' },
  { id: 's3', name: 'Sarah Williams', email: 'swilliams@umich.edu' },
  { id: 's4', name: 'James Martinez', email: 'jmartinez@umich.edu' },
  { id: 's5', name: 'Olivia Taylor', email: 'otaylor@umich.edu' },
];

export const StudentReport: React.FC = () => {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const [selectedClass, setSelectedClass] = useState('MATH 2420 - Calculus II');
  const [selectedExam, setSelectedExam] = useState('Midterm Exam');
  const [selectedSemester, setSelectedSemester] = useState('Spring 2026');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const studyPlan = getStudyPlan(selectedStudent.id);

  const getColor = (readiness: number) => {
    if (readiness >= 0.7) return '#FFCB05';
    if (readiness >= 0.5) return '#F5B942';
    return '#E05A5A';
  };

  const getConfidenceLevel = (readiness: number): 'high' | 'medium' | 'low' => {
    if (readiness >= 0.7) return 'high';
    if (readiness >= 0.5) return 'medium';
    return 'low';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl text-foreground mb-3">Student Concept Readiness Report</h1>
                
                {/* Filters */}
                <div className="flex items-center gap-3">
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]"
                  >
                    <option>MATH 2420 - Calculus II</option>
                    <option>MATH 1410 - Calculus I</option>
                    <option>MATH 3210 - Linear Algebra</option>
                  </select>
                  
                  <select 
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]"
                  >
                    <option>Midterm Exam</option>
                    <option>Final Exam</option>
                    <option>Quiz 1</option>
                    <option>Quiz 2</option>
                  </select>
                  
                  <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FFCB05] focus:border-[#FFCB05]"
                  >
                    <option>Spring 2026</option>
                    <option>Fall 2025</option>
                    <option>Spring 2025</option>
                  </select>
                </div>
              </div>
              
              {/* Student Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 hover:border-[#FFCB05] transition-colors"
                >
                  <div className="text-left">
                    <div className="text-xs text-foreground-secondary mb-0.5">Viewing Report For</div>
                    <div className="text-sm text-foreground font-medium">{selectedStudent.name}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-foreground-secondary transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    <div className="p-2 space-y-1">
                      {mockStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedStudent.id === student.id
                              ? 'bg-[#FFCB05]/10 text-[#00274C]'
                              : 'hover:bg-surface text-foreground'
                          }`}
                        >
                          <div className="text-sm font-medium">{student.name}</div>
                          <div className="text-xs text-foreground-secondary">{student.email}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-foreground-secondary">
              Overall Progress: <span className="text-[#00274C] font-medium">68%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Summary cards - Alternative Layout */}
          <div className="flex gap-4">
            <motion.div
              className="flex-1 bg-gradient-to-br from-[#FFCB05]/10 to-[#FFCB05]/5 border border-[#FFCB05]/30 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-foreground-secondary uppercase tracking-wide mb-2">Strong Concepts</div>
                  <div className="text-4xl text-[#00274C] font-medium mb-1">5</div>
                  <p className="text-xs text-foreground-secondary">
                    Concepts mastered with high readiness
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#FFCB05]/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#00274C]" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 bg-gradient-to-br from-[#F5B942]/10 to-[#F5B942]/5 border border-[#F5B942]/30 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-foreground-secondary uppercase tracking-wide mb-2">To Improve</div>
                  <div className="text-4xl text-[#00274C] font-medium mb-1">{studyPlan.length}</div>
                  <p className="text-xs text-foreground-secondary">
                    Concepts needing additional practice
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#F5B942]/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#F5B942]" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 bg-gradient-to-br from-[#E05A5A]/10 to-[#E05A5A]/5 border border-[#E05A5A]/30 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-foreground-secondary uppercase tracking-wide mb-2">Priority Focus</div>
                  <div className="text-4xl text-[#00274C] font-medium mb-1">
                    {studyPlan.filter(c => c.priority === 'high').length}
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    Critical gaps requiring attention
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#E05A5A]/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#E05A5A]" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Personal concept graph */}
          <motion.div
            className="bg-white border border-border rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg text-foreground mb-4">Your Concept Map</h2>
            <div className="bg-surface rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <StudentConceptGraph
                concepts={concepts}
                studentReadiness={
                  students.find((s) => s.id === selectedStudent.id)?.conceptReadiness ??
                  students[0].conceptReadiness
                }
              />
            </div>
            <p className="text-xs text-foreground-secondary text-center mt-4">
              Interactive view showing your mastery across all course concepts
            </p>
          </motion.div>

          {/* Study plan */}
          <motion.div
            className="bg-white border border-border rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-lg text-foreground mb-2">Your Personalized Study Plan</h2>
              <p className="text-sm text-foreground-secondary">
                Concepts are ordered by prerequisite dependencies. Focus on earlier items first for maximum impact.
              </p>
            </div>

            <div className="space-y-4">
              {studyPlan.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                >
                  {/* Connecting line */}
                  {idx < studyPlan.length - 1 && (
                    <div className="absolute left-6 top-full h-4 w-0.5 bg-border"></div>
                  )}

                  <div className="bg-surface border border-border rounded-xl p-5 hover:border-[#FFCB05]/50 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => setExpandedConcept(expandedConcept === item.id ? null : item.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Priority indicator */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center"
                        style={{ 
                          borderColor: item.priority === 'high' ? '#E05A5A' : item.priority === 'medium' ? '#F5B942' : '#5C6B7D',
                          backgroundColor: item.priority === 'high' ? 'rgba(224, 90, 90, 0.1)' : item.priority === 'medium' ? 'rgba(245, 185, 66, 0.1)' : 'rgba(92, 107, 125, 0.1)'
                        }}
                      >
                        <span className="text-sm font-mono font-medium"
                          style={{ color: item.priority === 'high' ? '#E05A5A' : item.priority === 'medium' ? '#F5B942' : '#5C6B7D' }}
                        >
                          {idx + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-base text-foreground mb-1">{item.name}</h3>
                            {item.prerequisites.length > 0 && (
                              <p className="text-xs text-foreground-secondary">
                                Requires: {item.prerequisites.join(', ')}
                              </p>
                            )}
                          </div>
                          <ConfidenceBadge level={getConfidenceLevel(item.currentLevel)} />
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-foreground-secondary">Current</span>
                            <span className="text-foreground-secondary">Target</span>
                          </div>
                          <div className="relative h-2 bg-white rounded-full overflow-hidden border border-border/50">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: getColor(item.currentLevel) }}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.currentLevel * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.6 + idx * 0.05 }}
                            />
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-[#00274C]"
                              style={{ left: `${item.targetLevel * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span style={{ color: getColor(item.currentLevel) }}>
                              {Math.round(item.currentLevel * 100)}%
                            </span>
                            <span className="text-[#00274C]">{Math.round(item.targetLevel * 100)}%</span>
                          </div>
                        </div>

                        {/* Expanded content */}
                        {expandedConcept === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-border space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white border border-border rounded-lg p-3">
                                <div className="text-xs text-foreground-secondary mb-1">Recommended Time</div>
                                <div className="text-sm text-foreground">2-3 hours</div>
                              </div>
                              <div className="bg-white border border-border rounded-lg p-3">
                                <div className="text-xs text-foreground-secondary mb-1">Practice Problems</div>
                                <div className="text-sm text-foreground">15-20 problems</div>
                              </div>
                            </div>
                            <div className="text-xs text-foreground-secondary">
                              Focus on understanding the core principles before moving to applications.
                              Review lecture notes and work through examples systematically.
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <ChevronRight 
                        className={`w-5 h-5 text-foreground-secondary transition-transform ${expandedConcept === item.id ? 'rotate-90' : ''}`} 
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Instructor/TA Contact Info */}
          <motion.div
            className="bg-[#00274C] text-white rounded-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-medium mb-4">Need Help? Contact Your Instructor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instructor Info */}
              <div className="space-y-3">
                <div className="text-sm opacity-75 uppercase tracking-wide">Instructor</div>
                <div className="text-xl font-medium">Dr. Sarah Mitchell</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 opacity-90">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:smitchell@umich.edu" className="hover:text-[#FFCB05] transition-colors">
                      smitchell@umich.edu
                    </a>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <Phone className="w-4 h-4" />
                    <span>(734) 647-3000</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>East Hall 2845</span>
                  </div>
                </div>
                <div className="pt-2 text-xs opacity-75">
                  Office Hours: Mon/Wed 2-4pm, Fri 10am-12pm
                </div>
              </div>

              {/* TA Info */}
              <div className="space-y-3">
                <div className="text-sm opacity-75 uppercase tracking-wide">Teaching Assistant</div>
                <div className="text-xl font-medium">Alex Chen</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 opacity-90">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:achen@umich.edu" className="hover:text-[#FFCB05] transition-colors">
                      achen@umich.edu
                    </a>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <Phone className="w-4 h-4" />
                    <span>(734) 647-3001</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>East Hall 1820</span>
                  </div>
                </div>
                <div className="pt-2 text-xs opacity-75">
                  Office Hours: Tue/Thu 3-5pm
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-90">
                Don't hesitate to reach out! We're here to help you succeed. Schedule a one-on-one meeting 
                or drop by during office hours to discuss your progress and study plan.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
