import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { resumeAPI } from '../utils/api';

export default function ResumeUpload({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setError('');
    setSuccess(false);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload a PDF, DOCX or DOC document.');
      return;
    }
    setFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', fileToUpload);
    try {
      const response = await resumeAPI.upload(formData);
      setSuccess(true);
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'File parsing failed. Please verify format and size.');
    } finally {
      setLoading(false);
    }
  };

  const triggerClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">STEP 1: Upload Resume</h3>
          <p className="text-xs text-dark-400">PDF, DOCX, or DOC formats up to 5MB</p>
        </div>
        {file && (
          <span className="text-xs bg-dark-800 text-dark-300 px-3 py-1 rounded-full font-medium">
            {file.name}
          </span>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerClick}
        className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-brand-500 bg-brand-500/5 glow-indigo'
            : success
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-dark-800 hover:border-brand-500 hover:bg-dark-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.docx,.doc"
        />

        {loading ? (
          <div className="flex flex-col items-center py-6">
            <span className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></span>
            <p className="text-sm font-semibold text-white">Parsing resume with NLP parser...</p>
            <p className="text-xs text-dark-400 mt-2">Extracting skills, contact info, and structural elements</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="text-sm font-semibold text-white">Resume processed successfully!</p>
            <p className="text-xs text-dark-400 mt-1">Skills extracted and cataloged.</p>
            <button
              onClick={(e) => { e.stopPropagation(); setSuccess(false); setFile(null); }}
              className="mt-4 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Upload another file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <Upload className="w-12 h-12 text-dark-500 mb-3 group-hover:text-brand-400 transition-colors" />
            <p className="text-sm font-semibold text-white">Drag & drop your resume here</p>
            <p className="text-xs text-dark-400 mt-1">or click to browse local files</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2 animate-shake">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
