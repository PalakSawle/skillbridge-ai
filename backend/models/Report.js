const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobDescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true
  },
  jobMatchScore: {
    type: Number,
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  employabilityScore: {
    type: Number,
    required: true
  },
  analysis: {
    skillsFound: [String],
    missingSkills: [String],
    strengths: [String],
    weaknesses: [String],
    atsFormattingIssues: [String]
  },
  roadmap: [
    {
      skill: String,
      difficulty: String,
      steps: [String],
      resources: [
        {
          title: String,
          url: String,
          type: String
        }
      ]
    }
  ],
  interviewPrep: [
    {
      question: String,
      answerHint: String,
      category: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
