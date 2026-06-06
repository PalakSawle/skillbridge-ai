const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    education: [String],
    experience: [String],
    certifications: [String],
    projects: [String],
    technicalSkills: [String],
    softSkills: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
