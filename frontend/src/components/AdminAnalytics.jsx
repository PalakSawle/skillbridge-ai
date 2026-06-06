import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { ShieldAlert, Users, FileText, CheckCircle, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getAnalytics();
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin placement analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></span>
        <p className="text-sm text-dark-300">Compiling placement metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return null;

  const {
    totalUsers = 0,
    totalResumes = 0,
    totalReports = 0,
    avgMatchScore = 0,
    avgAtsScore = 0,
    avgEmployabilityScore = 0,
    missingSkills = [],
    targetedRoles = []
  } = data;

  const skillsChartData = missingSkills.map(item => ({
    name: item.skill,
    Count: item.count
  }));

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-dark-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-400" />
            Placement Cell Administration
          </h2>
          <p className="text-xs text-dark-400 mt-1">
            Aggregate student metrics, training requirements, and recruitment analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block">Total Registered Users</span>
            <span className="text-2xl font-black text-white">{totalUsers}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block">Resumes Processed</span>
            <span className="text-2xl font-black text-white">{totalResumes}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest block">Reports Generated</span>
            <span className="text-2xl font-black text-white">{totalReports}</span>
          </div>
        </div>

      </div>

      <div className="p-6 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-white mb-4">Average Student Performance Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          
          <div className="p-4 bg-dark-900/60 rounded-xl border border-dark-800">
            <div className="text-2xl font-black text-brand-400 mb-1">{avgMatchScore}%</div>
            <div className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider">Average Job Fit Score</div>
          </div>

          <div className="p-4 bg-dark-900/60 rounded-xl border border-dark-800">
            <div className="text-2xl font-black text-violet-400 mb-1">{avgAtsScore}/100</div>
            <div className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider">Average ATS Score</div>
          </div>

          <div className="p-4 bg-dark-900/60 rounded-xl border border-dark-800">
            <div className="text-2xl font-black text-emerald-400 mb-1">{avgEmployabilityScore}/100</div>
            <div className="text-[10px] font-semibold text-dark-400 uppercase tracking-wider">Employability Index</div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            Top 10 Skill Gaps (Critical Gaps)
          </h3>
          <div className="h-64">
            {skillsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <XAxis type="number" stroke="#6a7891" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#6a7891" fontSize={10} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: '#1e222b', border: '1px solid #3a4150', borderRadius: 12, fontSize: 11 }} />
                  <Bar dataKey="Count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-dark-500 italic text-center pt-24">No statistics collected yet.</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Most Targeted Job Roles
            </h3>
            
            <div className="space-y-3">
              {targetedRoles.map((roleObj, idx) => (
                <div key={idx} className="p-3.5 bg-dark-900 border border-dark-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-dark-800 text-[10px] font-bold text-white flex items-center justify-center border border-dark-700">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white">{roleObj.role}</span>
                  </div>
                  
                  <span className="text-xs font-bold text-dark-400">
                    {roleObj.count} applications
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-dark-500 italic border-t border-dark-800 pt-4 mt-6">
            Tip: Plan targeted workshops for the top-ranking missing skills to boost overall campus placement rates.
          </div>
        </div>

      </div>

    </div>
  );
}
