import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { UploadWizard } from './pages/UploadWizard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { RootCauseTrace } from './pages/RootCauseTrace';
import { StudentReport } from './pages/StudentReport';
import { Sidebar } from './components/Sidebar';
import { Chatbot } from './components/Chatbot';
import type { ConceptNode } from './data/mockData';

type View = 'landing' | 'upload' | 'dashboard' | 'trace' | 'student';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null);

  const handleLogin = () => {
    setCurrentView('upload');
  };

  const handleUploadComplete = () => {
    setCurrentView('dashboard');
  };

  const handleConceptClick = (concept: ConceptNode) => {
    setSelectedConcept(concept);
    setCurrentView('trace');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedConcept(null);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view !== 'trace') {
      setSelectedConcept(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content with left padding for sidebar */}
      <div className="pl-20">
        {currentView === 'landing' && <LandingPage onLogin={handleLogin} />}
        {currentView === 'upload' && <UploadWizard onComplete={handleUploadComplete} />}
        {currentView === 'dashboard' && <InstructorDashboard onConceptClick={handleConceptClick} />}
        {currentView === 'trace' && selectedConcept && (
          <RootCauseTrace concept={selectedConcept} onBack={handleBackToDashboard} />
        )}
        {currentView === 'student' && <StudentReport />}
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
