import React, { useState } from 'react';
import { FileSearch, Sparkles, AlertCircle } from 'lucide-react';
import { jobAPI } from '../utils/api';

export default function JobInput({ onJobCreated }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim() || !text.trim()) {
      setError('Please provide both a job title and description text.');
      return;
    }
    setLoading(true);

    try {
      const response = await jobAPI.create({ title, text });
      setSuccess(true);
      if (onJobCreated) {
        onJobCreated(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">STEP 2: Enter Job Description</h3>
          <p className="text-xs text-dark-400">Specify job role title and copy-paste requirements</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
            Target Job Title
          </label>
          <input
            type="text"
            required
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Full Stack Developer, Data Analyst"
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-xl focus:ring-1 focus:ring-brand-500 text-white text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
            Job Description / Requirements
          </label>
          <textarea
            required
            rows={6}
            disabled={loading}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job requirements, skills, and expectations here..."
            className="w-full px-4 py-3 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-xl focus:ring-1 focus:ring-brand-500 text-white text-sm outline-none transition-all resize-y"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className={`w-full py-3 text-white font-semibold rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 shadow-lg ${
            success
              ? 'bg-emerald-600 shadow-emerald-500/20 cursor-default'
              : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20 disabled:opacity-50'
          }`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Extracting Job Skills & Keywords...
            </>
          ) : success ? (
            <>
              <Sparkles className="w-5 h-5 text-white" />
              Job Profile Configured Successfully!
            </>
          ) : (
            <>
              <FileSearch className="w-5 h-5" />
              Confirm Job Description
            </>
          )}
        </button>
      </form>
    </div>
  );
}
