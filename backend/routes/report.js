const express = require('express');
const router = express.Router();
const axios = require('axios');
const Report = require('../models/Report');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({ success: false, message: 'Please provide resumeId and jobId' });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const job = await JobDescription.findOne({ _id: jobId, user: req.user.id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job description not found' });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    const aiResponse = await axios.post(`${aiServiceUrl}/analyze-fit`, {
      resumeText: resume.text || '',
      resumeSkills: [
        ...(resume.parsedData?.technicalSkills || []),
        ...(resume.parsedData?.softSkills || [])
      ],
      resumeData: {
        education: resume.parsedData?.education || [],
        experience: resume.parsedData?.experience || [],
        certifications: resume.parsedData?.certifications || [],
        projects: resume.parsedData?.projects || []
      },
      jobText: job.text || '',
      jobSkills: [
        ...(job.extractedSkills?.technicalSkills || []),
        ...(job.extractedSkills?.softSkills || [])
      ]
    });

    const aiData = aiResponse.data;

    const report = await Report.create({
      user: req.user.id,
      resume: resumeId,
      jobDescription: jobId,
      jobMatchScore: aiData.jobMatchScore || 0,
      atsScore: aiData.atsScore || 0,
      employabilityScore: aiData.employabilityScore || 0,
      analysis: {
        skillsFound: aiData.analysis?.skillsFound || [],
        missingSkills: aiData.analysis?.missingSkills || [],
        strengths: aiData.analysis?.strengths || [],
        weaknesses: aiData.analysis?.weaknesses || [],
        atsFormattingIssues: aiData.analysis?.atsFormattingIssues || []
      },
      roadmap: aiData.roadmap || [],
      interviewPrep: aiData.interviewPrep || []
    });

    const populatedReport = await Report.findById(report._id)
      .populate('resume', 'filename createdAt')
      .populate('jobDescription', 'title createdAt');

    res.status(201).json({
      success: true,
      data: populatedReport
    });
  } catch (error) {
    console.error('Error generating report:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report: ' + (error.response?.data?.detail || error.message)
    });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .populate('resume', 'filename createdAt')
      .populate('jobDescription', 'title createdAt')
      .sort('-createdAt');

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user.id })
      .populate('resume')
      .populate('jobDescription');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user.id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    await report.deleteOne();
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
