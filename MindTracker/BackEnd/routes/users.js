const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users by name or email
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name email avatar streak')
    .limit(10);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/friends
// @desc    Send friend request
// @access  Private
router.post('/friends', auth, [
  body('userId').isMongoId().withMessage('Valid user ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already friends
    if (req.user.friends.includes(userId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Add to friends list
    req.user.friends.push(userId);
    targetUser.friends.push(req.user._id);

    await req.user.save();
    await targetUser.save();

    res.json({
      success: true,
      message: 'Friend added successfully'
    });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/friends/:userId
// @desc    Remove friend
// @access  Private
router.delete('/friends/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove from both users' friend lists
    req.user.friends = req.user.friends.filter(id => id.toString() !== userId);
    await req.user.save();

    const targetUser = await User.findById(userId);
    if (targetUser) {
      targetUser.friends = targetUser.friends.filter(id => id.toString() !== req.user._id.toString());
      await targetUser.save();
    }

    res.json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/friends
// @desc    Get user's friends
// @access  Private
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name email avatar streak achievements')
      .select('friends');

    res.json({
      success: true,
      friends: user.friends
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get friends leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'friends',
        select: 'name avatar streak achievements',
        options: { sort: { 'streak.current': -1 } }
      })
      .select('friends');

    const leaderboard = [
      {
        user: {
          id: req.user._id,
          name: req.user.name,
          avatar: req.user.avatar
        },
        streak: req.user.streak.current,
        achievements: req.user.achievements.length
      },
      ...user.friends.map(friend => ({
        user: {
          id: friend._id,
          name: friend.name,
          avatar: friend.avatar
        },
        streak: friend.streak.current,
        achievements: friend.achievements.length
      }))
    ].sort((a, b) => b.streak - a.streak);

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/profile
// @desc    Get user profile (public info only)
// @access  Private
router.get('/:id/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name avatar streak achievements')
      .populate('achievements');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/achievements
// @desc    Add achievement to user
// @access  Private
router.post('/achievements', auth, [
  body('type').isIn(['streak', 'habit', 'goal', 'social']).withMessage('Valid achievement type is required'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Achievement title is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const achievement = {
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      earnedAt: new Date()
    };

    req.user.achievements.push(achievement);
    await req.user.save();

    res.json({
      success: true,
      achievement
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
