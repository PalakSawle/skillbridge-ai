import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Auth from './components/Auth';
import ResumeUpload from './components/ResumeUpload';
import JobInput from './components/JobInput';
import Dashboard from './components/Dashboard';
import RoadmapView from './components/RoadmapView';
import InterviewPrep from './components/InterviewPrep';
import History from './components/History';
import AdminAnalytics from './components/AdminAnalytics';
import { reportAPI, authAPI } from './utils/api';
import { Sparkles, FileText, Compass, MessageSquareCode, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('analyze');
  const [appLoading, setAppLoading] = useState(true);
  
  const [uploadedResume, setUploadedResume] = useState(null);
  const [configuredJob, setConfiguredJob] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  
  const [currentReport, setCurrentReport] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authAPI.me();
          setUser(data.user);
        } catch (err) {
          console.error('Session expired:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setAppLoading(false);
    };
    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentTab('analyze');
    setUploadedResume(null);
    setConfiguredJob(null);
    setCurrentReport(null);
  };

  const handleGenerateReport = async () => {
    if (!uploadedResume?._id || !configuredJob?._id) return;
    
    setGeneratingReport(true);
    setReportError('');
    try {
      const response = await reportAPI.generate({
        resumeId: uploadedResume._id,
        jobId: configuredJob._id
      });
      setCurrentReport(response.data);
      setCurrentTab('dashboard');
    } catch (err) {
      console.error(err);
      setReportError(err.response?.data?.message || 'Matching process failed. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const loadReportById = async (id) => {
    setAppLoading(true);
    try {
      const response = await reportAPI.getOne(id);
      setCurrentReport(response.data);
      setCurrentTab('dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to retrieve report.');
    } finally {
      setAppLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-950">
        <span className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></span>
        <p className="text-sm text-dark-300 font-semibold uppercase tracking-wider">SkillBridge AI Booting...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-mesh transition-all duration-300 py-12">
        <Auth onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-mesh text-dark-100' : 'bg-mesh-light text-dark-900 light'}`}>
      
      <Header
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {generatingReport && (
          <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
            <span className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-6"></span>
            <h3 className="text-xl font-bold text-white mb-2 animate-pulse">Running AI Semantic Matching Engine</h3>
            <p className="text-xs text-dark-400 max-w-sm text-center">
              Generating vector embeddings, comparing profiles, checking ATS criteria, and formulating customized roadmaps...
            </p>
          </div>
        )}

        {['dashboard', 'roadmap', 'interview'].includes(currentTab) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-dark-800/50 no-print">
            <button
              onClick={() => setCurrentTab('analyze')}
              className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Analyzer Workspace
            </button>

            <div className="flex gap-1.5 bg-dark-900/60 p-1.5 border border-dark-800 rounded-2xl">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  currentTab === 'dashboard' ? 'bg-brand-500 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('roadmap')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  currentTab === 'roadmap' ? 'bg-brand-500 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Roadmap
              </button>
              <button
                onClick={() => setCurrentTab('interview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  currentTab === 'interview' ? 'bg-brand-500 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                <MessageSquareCode className="w-3.5 h-3.5" /> Interview Prep
              </button>
            </div>
          </div>
        )}

        {currentTab === 'analyze' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> HACKATHON BETA
              </span>
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                SkillBridge AI Analyzer
              </h1>
              <p className="text-sm text-dark-400">
                Unlock career insights. Upload your resume and paste target requirements to discover alignment, fix ATS issues, and construct learning paths.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div className="p-6 rounded-2xl glass-panel relative">
                <ResumeUpload onUploadComplete={(resume) => setUploadedResume(resume)} />
              </div>
              
              <div className="p-6 rounded-2xl glass-panel relative">
                <JobInput onJobCreated={(job) => setConfiguredJob(job)} />
              </div>
            </div>

            <div className="flex justify-center pt-8 border-t border-dark-800/40">
              <div className="text-center space-y-4 max-w-sm">
                {reportError && (
                  <p className="text-xs text-red-400 bg-red-500/10 p-2.5 border border-red-500/20 rounded-xl">{reportError}</p>
                )}
                
                <button
                  onClick={handleGenerateReport}
                  disabled={!uploadedResume || !configuredJob}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/10 text-white font-bold text-base rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group w-full"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Perform Fit Matching
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-[10px] text-dark-500 italic">
                  Ensure both steps are complete before triggering vector embeddings analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'dashboard' && currentReport && (
          <Dashboard report={currentReport} onNextTab={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'roadmap' && currentReport && (
          <RoadmapView roadmap={currentReport.roadmap} />
        )}

        {currentTab === 'interview' && currentReport && (
          <InterviewPrep interviewPrep={currentReport.interviewPrep} />
        )}

        {currentTab === 'history' && (
          <History onLoadReport={loadReportById} />
        )}

        {currentTab === 'admin' && (
          <AdminAnalytics />
        )}

      </main>

      <footer className="border-t border-dark-900 py-6 text-center text-xs text-dark-500 no-print mt-12 bg-dark-950/20">
        &copy; {new Date().getFullYear()} SkillBridge AI. Hackathon Sandbox Release. All rights reserved.
      </footer>

    </div>
  );
}
