const express = require('express');
const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const goals = await Goal.find({ 
      user: req.user._id, 
      status: status === 'all' ? { $exists: true } : status 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/goals
// @desc    Create new goal
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Goal title is required'),
  body('category').optional().isIn(['health', 'fitness', 'career', 'learning', 'personal', 'financial', 'social', 'other']),
  body('type').optional().isIn(['habit', 'milestone', 'target', 'challenge']),
  body('targetValue').optional().isInt({ min: 1 }).withMessage('Target value must be a positive integer'),
  body('deadline').isISO8601().withMessage('Please provide a valid deadline'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();

    res.status(201).json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Goal title is required'),
  body('category').optional().isIn(['health', 'fitness', 'career', 'learning', 'personal', 'financial', 'social', 'other']),
  body('type').optional().isIn(['habit', 'milestone', 'target', 'challenge']),
  body('targetValue').optional().isInt({ min: 1 }).withMessage('Target value must be a positive integer'),
  body('deadline').optional().isISO8601().withMessage('Please provide a valid deadline'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/goals/:id/progress
// @desc    Add progress to goal
// @access  Private
router.post('/:id/progress', auth, [
  body('value').isInt({ min: 0 }).withMessage('Value must be a non-negative integer'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Add progress entry
    goal.progress.push({
      value: req.body.value,
      notes: req.body.notes,
      date: new Date()
    });

    // Update current value
    goal.currentValue += req.body.value;

    // Check if goal is completed
    if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
    }

    // Check milestones
    if (goal.milestones && goal.milestones.length > 0) {
      goal.milestones.forEach(milestone => {
        if (!milestone.completed && goal.currentValue >= milestone.targetValue) {
          milestone.completed = true;
          milestone.completedAt = new Date();
        }
      });
    }

    await goal.save();

    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Add goal progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/goals/:id/progress
// @desc    Get goal progress
// @access  Private
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({
      success: true,
      progress: goal.progress,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      progressPercentage: goal.progressPercentage
    });
  } catch (error) {
    console.error('Get goal progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/goals/stats
// @desc    Get goal statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    
    const stats = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      paused: goals.filter(g => g.status === 'paused').length,
      cancelled: goals.filter(g => g.status === 'cancelled').length,
      completionRate: goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0,
      averageProgress: goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progressPercentage, 0) / goals.length) : 0,
      upcomingDeadlines: goals
        .filter(g => g.status === 'active' && g.daysRemaining <= 7)
        .sort((a, b) => a.daysRemaining - b.daysRemaining)
        .slice(0, 5)
        .map(goal => ({
          id: goal._id,
          title: goal.title,
          daysRemaining: goal.daysRemaining,
          progressPercentage: goal.progressPercentage
        }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
