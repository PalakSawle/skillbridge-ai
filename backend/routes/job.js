const express = require('express');
const router = express.Router();
const axios = require('axios');
const JobDescription = require('../models/JobDescription');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ success: false, message: 'Please provide job title and description text' });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    let extractedSkills = { technicalSkills: [], softSkills: [] };

    try {
      const aiResponse = await axios.post(`${aiServiceUrl}/extract-skills`, { text });
      extractedSkills = aiResponse.data;
    } catch (err) {
      console.error('Failed to extract skills from AI service:', err.message);
      const textLower = text.toLowerCase();
      const techWords = ['javascript', 'python', 'java', 'react', 'node', 'mongodb', 'sql', 'docker', 'kubernetes', 'aws', 'git', 'c++', 'html', 'css', 'typescript', 'go', 'rust'];
      const softWords = ['communication', 'teamwork', 'leadership', 'problem solving', 'collaboration', 'adaptability', 'management'];
      extractedSkills.technicalSkills = techWords.filter(word => textLower.includes(word));
      extractedSkills.softSkills = softWords.filter(word => textLower.includes(word));
    }

    const jobDesc = await JobDescription.create({
      user: req.user.id,
      title,
      text,
      extractedSkills
    });

    res.status(201).json({
      success: true,
      data: jobDesc
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const jobs = await JobDescription.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const job = await JobDescription.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job description not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
