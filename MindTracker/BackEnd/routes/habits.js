const express = require('express');
const { body, validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const HabitEntry = require('../models/HabitEntry');
const User = require('../models/User');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    // Get today's entries for each habit
    const today = moment().startOf('day').toDate();
    const entries = await HabitEntry.find({
      user: req.user._id,
      date: { $gte: today, $lt: moment(today).endOf('day').toDate() }
    });

    const habitsWithEntries = habits.map(habit => {
      const entry = entries.find(e => e.habit.toString() === habit._id.toString());
      return {
        ...habit.toObject(),
        todayEntry: entry || null
      };
    });

    res.json({
      success: true,
      habits: habitsWithEntries
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits
// @desc    Create new habit
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Habit name is required'),
  body('category').optional().isIn(['health', 'fitness', 'mindfulness', 'learning', 'social', 'productivity', 'other']),
  body('frequency').optional().isIn(['daily', 'weekly', 'custom']),
  body('target').optional().isInt({ min: 1 }).withMessage('Target must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user._id
    });

    await habit.save();

    res.status(201).json({
      success: true,
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({
      success: true,
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Delete all entries for this habit
    await HabitEntry.deleteMany({ habit: req.params.id });

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits/:id/entries
// @desc    Log habit entry
// @access  Private
router.post('/:id/entries', auth, [
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
  body('value').optional().isInt({ min: 0 }).withMessage('Value must be a non-negative integer'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = moment().startOf('day').toDate();
    const endOfDay = moment(today).endOf('day').toDate();

    // Check if entry already exists for today
    let entry = await HabitEntry.findOne({
      habit: req.params.id,
      user: req.user._id,
      date: { $gte: today, $lt: endOfDay }
    });

    if (entry) {
      // Update existing entry
      entry = await HabitEntry.findByIdAndUpdate(
        entry._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new entry
      entry = new HabitEntry({
        ...req.body,
        habit: req.params.id,
        user: req.user._id,
        date: today
      });
      await entry.save();
    }

    // Update habit stats
    if (req.body.completed) {
      habit.stats.totalCompletions += 1;
      habit.stats.lastCompleted = new Date();
      
      // Update streak
      const yesterday = moment().subtract(1, 'day').startOf('day').toDate();
      const yesterdayEntry = await HabitEntry.findOne({
        habit: req.params.id,
        user: req.user._id,
        date: { $gte: yesterday, $lt: moment(yesterday).endOf('day').toDate() },
        completed: true
      });

      if (yesterdayEntry) {
        habit.stats.currentStreak += 1;
      } else {
        habit.stats.currentStreak = 1;
      }
      
      habit.stats.longestStreak = Math.max(habit.stats.longestStreak, habit.stats.currentStreak);
    }

    await habit.save();

    // Update user streak
    await req.user.updateStreak();

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Log habit entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/habits/:id/entries
// @desc    Get habit entries for date range
// @access  Private
router.get('/:id/entries', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? moment(startDate).startOf('day').toDate() : moment().subtract(30, 'days').startOf('day').toDate();
    const end = endDate ? moment(endDate).endOf('day').toDate() : moment().endOf('day').toDate();

    const entries = await HabitEntry.find({
      habit: req.params.id,
      user: req.user._id,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json({
      success: true,
      entries
    });
  } catch (error) {
    console.error('Get habit entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/habits/stats
// @desc    Get habit statistics
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

    const habits = await Habit.find({ user: req.user._id, isActive: true });
    const entries = await HabitEntry.find({
      user: req.user._id,
      date: { $gte: startDate },
      completed: true
    });

    const stats = {
      totalHabits: habits.length,
      totalCompletions: entries.length,
      completionRate: habits.length > 0 ? Math.round((entries.length / (habits.length * 7)) * 100) : 0,
      topHabits: habits
        .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
        .slice(0, 5)
        .map(habit => ({
          id: habit._id,
          name: habit.name,
          streak: habit.stats.currentStreak
        }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
