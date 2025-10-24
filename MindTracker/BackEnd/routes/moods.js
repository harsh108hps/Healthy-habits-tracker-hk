const express = require('express');
const { body, validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/moods
// @desc    Get mood entries for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    const start = startDate ? moment(startDate).startOf('day').toDate() : moment().subtract(30, 'days').startOf('day').toDate();
    const end = endDate ? moment(endDate).endOf('day').toDate() : moment().endOf('day').toDate();

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    })
    .sort({ date: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      moods
    });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/moods
// @desc    Log mood entry
// @access  Private
router.post('/', auth, [
  body('mood').isIn(['excellent', 'good', 'okay', 'poor', 'terrible']).withMessage('Invalid mood value'),
  body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1 and 10'),
  body('stress').optional().isInt({ min: 1, max: 10 }).withMessage('Stress must be between 1 and 10'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const today = moment().startOf('day').toDate();
    const endOfDay = moment(today).endOf('day').toDate();

    // Check if mood entry already exists for today
    let mood = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: endOfDay }
    });

    if (mood) {
      // Update existing entry
      mood = await Mood.findByIdAndUpdate(
        mood._id,
        { ...req.body, date: today },
        { new: true, runValidators: true }
      );
    } else {
      // Create new entry
      mood = new Mood({
        ...req.body,
        user: req.user._id,
        date: today
      });
      await mood.save();
    }

    res.json({
      success: true,
      mood
    });
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/moods/:id
// @desc    Update mood entry
// @access  Private
router.put('/:id', auth, [
  body('mood').optional().isIn(['excellent', 'good', 'okay', 'poor', 'terrible']).withMessage('Invalid mood value'),
  body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1 and 10'),
  body('stress').optional().isInt({ min: 1, max: 10 }).withMessage('Stress must be between 1 and 10'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({
      success: true,
      mood
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/moods/:id
// @desc    Delete mood entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }

    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/stats
// @desc    Get mood statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate;

    switch (period) {
      case 'week':
        startDate = moment().subtract(7, 'days').startOf('day').toDate();
        break;
      case 'month':
        startDate = moment().subtract(30, 'days').startOf('day').toDate();
        break;
      case 'year':
        startDate = moment().subtract(365, 'days').startOf('day').toDate();
        break;
      default:
        startDate = moment().subtract(7, 'days').startOf('day').toDate();
    }

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: startDate }
    });

    const moodCounts = {
      excellent: 0,
      good: 0,
      okay: 0,
      poor: 0,
      terrible: 0
    };

    let totalEnergy = 0;
    let totalStress = 0;
    let totalSleepHours = 0;
    let sleepQualityCounts = { excellent: 0, good: 0, fair: 0, poor: 0 };

    moods.forEach(mood => {
      moodCounts[mood.mood]++;
      totalEnergy += mood.energy || 0;
      totalStress += mood.stress || 0;
      if (mood.sleep && mood.sleep.hours) {
        totalSleepHours += mood.sleep.hours;
      }
      if (mood.sleep && mood.sleep.quality) {
        sleepQualityCounts[mood.sleep.quality]++;
      }
    });

    const stats = {
      totalEntries: moods.length,
      moodDistribution: moodCounts,
      averageEnergy: moods.length > 0 ? Math.round((totalEnergy / moods.length) * 10) / 10 : 0,
      averageStress: moods.length > 0 ? Math.round((totalStress / moods.length) * 10) / 10 : 0,
      averageSleepHours: moods.length > 0 ? Math.round((totalSleepHours / moods.length) * 10) / 10 : 0,
      sleepQualityDistribution: sleepQualityCounts,
      recentTrend: moods.slice(0, 7).map(mood => ({
        date: mood.date,
        mood: mood.mood,
        energy: mood.energy,
        stress: mood.stress
      }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/today
// @desc    Get today's mood entry
// @access  Private
router.get('/today', auth, async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();
    const endOfDay = moment(today).endOf('day').toDate();

    const mood = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: endOfDay }
    });

    res.json({
      success: true,
      mood
    });
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
