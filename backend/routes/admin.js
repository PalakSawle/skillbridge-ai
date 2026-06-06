const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resume = require('../models/Resume');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

router.get('/analytics', protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalReports = await Report.countDocuments();

    const averageScores = await Report.aggregate([
      {
        $group: {
          _id: null,
          avgMatchScore: { $avg: '$jobMatchScore' },
          avgAtsScore: { $avg: '$atsScore' },
          avgEmployabilityScore: { $avg: '$employabilityScore' }
        }
      }
    ]);

    const stats = averageScores[0] || {
      avgMatchScore: 0,
      avgAtsScore: 0,
      avgEmployabilityScore: 0
    };

    const commonMissingSkills = await Report.aggregate([
      { $unwind: '$analysis.missingSkills' },
      {
        $group: {
          _id: { $toLower: '$analysis.missingSkills' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          skill: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const targetedJobRoles = await Report.aggregate([
      {
        $lookup: {
          from: 'jobdescriptions',
          localField: 'jobDescription',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      {
        $group: {
          _id: '$job.title',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          role: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const demoMissingSkills = [
      { skill: 'Docker', count: 8 },
      { skill: 'Kubernetes', count: 6 },
      { skill: 'AWS Cloud', count: 5 },
      { skill: 'TypeScript', count: 5 },
      { skill: 'GraphQL', count: 4 },
      { skill: 'Redis', count: 3 },
      { skill: 'CI/CD Pipelines', count: 3 }
    ];

    const demoJobRoles = [
      { role: 'Full Stack Engineer', count: 12 },
      { role: 'Backend Developer', count: 9 },
      { role: 'Frontend React Developer', count: 7 },
      { role: 'Data Scientist', count: 4 },
      { role: 'DevOps Engineer', count: 3 }
    ];

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers || 24,
        totalResumes: totalResumes || 32,
        totalReports: totalReports || 45,
        avgMatchScore: Math.round(stats.avgMatchScore || 72),
        avgAtsScore: Math.round(stats.avgAtsScore || 68),
        avgEmployabilityScore: Math.round(stats.avgEmployabilityScore || 74),
        missingSkills: commonMissingSkills.length > 0 ? commonMissingSkills : demoMissingSkills,
        targetedRoles: targetedJobRoles.length > 0 ? targetedJobRoles : demoJobRoles
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
