import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check, X, ShieldAlert, Award, FileSpreadsheet, ArrowRight, Printer } from 'lucide-react';

export default function Dashboard({ report, onNextTab }) {
  if (!report) return null;

  const {
    jobMatchScore = 0,
    atsScore = 0,
    employabilityScore = 0,
    analysis = {},
    resume = {},
    jobDescription = {}
  } = report;

  const {
    skillsFound = [],
    missingSkills = [],
    strengths = [],
    weaknesses = [],
    atsFormattingIssues = []
  } = analysis;

  const chartData = [
    { name: 'Core Match', Resume: skillsFound.length, JobRequired: skillsFound.length + missingSkills.length },
    { name: 'Total Skills', Resume: skillsFound.length, JobRequired: 15 },
    { name: 'Strengths', Resume: strengths.length, JobRequired: 4 },
    { name: 'Weak Gaps', Resume: 5 - weaknesses.length, JobRequired: 5 },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'text-brand-400 border-brand-500/30';
    return 'text-amber-400 border-amber-500/30';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-800 pb-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Analysis Dashboard: <span className="text-brand-400">{jobDescription.title || 'Role'}</span>
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Analyzing resume: <span className="text-white font-medium">{resume.filename || 'uploaded_resume.pdf'}</span>
          </p>
        </div>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-800 text-dark-300 hover:text-white rounded-xl text-sm font-semibold transition-all hover:border-dark-700"
        >
          <Printer className="w-4 h-4" />
          Export Report PDF
        </button>
      </div>

      <div className="hidden print:block text-black mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-extrabold">SKILLBRIDGE AI - ANALYSIS REPORT</h1>
        <p className="text-sm text-gray-600 mt-2">Target Job: {jobDescription.title || 'Role'}</p>
        <p className="text-sm text-gray-600">Resume Analyzed: {resume.filename || 'uploaded_resume.pdf'}</p>
        <p className="text-sm text-gray-600">Date Generated: {new Date(report.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel text-center flex flex-col items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-widest mb-4">Job Match Fit</h4>
          
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(jobMatchScore)}`}>
            <div className="text-center">
              <span className="text-4xl font-black text-white">{jobMatchScore}</span>
              <span className="text-xs text-dark-400 block">%</span>
            </div>
          </div>
          <p className="text-xs text-dark-300 px-4">
            Semantic overlap indicating how closely your skills fit the role requirements.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel text-center flex flex-col items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-widest mb-4">ATS Compatibility</h4>
          
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(atsScore)}`}>
            <div className="text-center">
              <span className="text-4xl font-black text-white">{atsScore}</span>
              <span className="text-xs text-dark-400 block">/100</span>
            </div>
          </div>
          <p className="text-xs text-dark-300 px-4">
            Measures formatting compliance, headings structure, and keyword density.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel text-center flex flex-col items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-widest mb-4">Employability Score</h4>
          
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-4 ${getScoreColor(employabilityScore)}`}>
            <div className="text-center">
              <span className="text-4xl font-black text-white">{employabilityScore}</span>
              <span className="text-xs text-dark-400 block">/100</span>
            </div>
          </div>
          <p className="text-xs text-dark-300 px-4">
            Composite score accounting for projects, experience history, and skills list.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel">
          <h3 className="text-base font-bold text-white mb-4">Resume-to-Job Distribution Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6a7891" fontSize={11} tickLine={false} />
                <YAxis stroke="#6a7891" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e222b', border: '1px solid #3a4150', borderRadius: 12, fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Resume" fill="#6366f1" radius={[4, 4, 0, 0]} name="Your Profile" />
                <Bar dataKey="JobRequired" fill="#3a4150" radius={[4, 4, 0, 0]} name="Job Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel flex flex-col">
          <h3 className="text-base font-bold text-white mb-4">Skills Match Matrix</h3>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-4 h-4" /> Found ({skillsFound.length})
              </h4>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
                {skillsFound.length > 0 ? (
                  skillsFound.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl text-xs text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-dark-500 italic">No skills matched in the CV.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <X className="w-4 h-4" /> Missing ({missingSkills.length})
              </h4>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 px-3 py-1.5 rounded-xl text-xs text-dark-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-emerald-400 italic">No missing skills! Outstanding match.</p>
                )}
              </div>
            </div>

          </div>

          {missingSkills.length > 0 && (
            <button
              onClick={() => onNextTab('roadmap')}
              className="mt-4 w-full py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 hover:text-brand-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all no-print"
            >
              Examine Learning Roadmap
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-base font-bold text-white">Profile Evaluation</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Strengths Areas</h4>
              <ul className="space-y-2">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-emerald-300 flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                    <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Areas for Improvement</h4>
              <ul className="space-y-2">
                {weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-xs text-amber-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            ATS Compliance Check
            {atsFormattingIssues.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {atsFormattingIssues.length} Audits
              </span>
            )}
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {atsFormattingIssues.length > 0 ? (
              atsFormattingIssues.map((issue, idx) => (
                <div key={idx} className="p-3 bg-dark-900 border border-dark-800 rounded-xl flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white font-medium">Layout Audit</p>
                    <p className="text-xs text-dark-400 mt-1">{issue}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-white">Outstanding Resume Formatting!</p>
                <p className="text-[10px] text-dark-400 mt-1">No major layout issues or formatting blockers found.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
