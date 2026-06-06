const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or Word documents (.doc/.docx) are allowed!'));
    }
  }
});

router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const aiResponse = await axios.post(`${aiServiceUrl}/parse-resume`, form, {
      headers: {
        ...form.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const parsedData = aiResponse.data;

    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.originalname,
      filepath: 'memory',
      text: parsedData.text || '',
      parsedData: {
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        education: parsedData.education || [],
        experience: parsedData.experience || [],
        certifications: parsedData.certifications || [],
        projects: parsedData.projects || [],
        technicalSkills: parsedData.technicalSkills || [],
        softSkills: parsedData.softSkills || []
      }
    });

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error in resume upload:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process resume: ' + (error.response?.data?.detail || error.message)
    });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
