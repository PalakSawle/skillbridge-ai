import React, { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import { History as HistoryIcon, FileText, ChevronRight, Trash2, AlertTriangle, Sparkles } from 'lucide-react';

export default function History({ onLoadReport }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reportAPI.getAll();
      setReports(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load reports history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await reportAPI.delete(id);
      setReports(reports.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete report.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></span>
        <p className="text-sm text-dark-300">Retrieving report archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-brand-400" />
          Previous Reports & Match History
        </h2>
        <p className="text-xs text-dark-400 mt-1">
          Review and compare resume matching results from previous analyses.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Reports Found</h3>
          <p className="text-xs text-dark-400 mt-1 max-w-sm mx-auto">
            You haven't run any resume analyses yet. Head over to the Analyze page to upload a resume and match it to a job description.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const date = new Date(report.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={report._id}
                onClick={() => onLoadReport(report._id)}
                className="p-5 bg-dark-900 border border-dark-800 hover:border-brand-500 hover:bg-dark-900/80 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 group hover:shadow-lg hover:shadow-brand-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                      {report.jobDescription?.title || 'Unknown Role'}
                    </h3>
                    <p className="text-[10px] text-dark-400 mt-0.5">
                      File: {report.resume?.filename || 'resume.pdf'}
                    </p>
                    <p className="text-[10px] text-dark-500 mt-1">
                      Analyzed on {date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-black text-brand-400">{report.jobMatchScore}%</div>
                    <div className="text-[9px] font-bold text-dark-400 uppercase tracking-wider">Fit Score</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(e, report._id)}
                      className="p-2 text-dark-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-white transition-colors" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
