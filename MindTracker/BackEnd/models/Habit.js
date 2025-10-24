const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a habit name'],
    trim: true,
    maxlength: [100, 'Habit name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'mindfulness', 'learning', 'social', 'productivity', 'other'],
    default: 'health'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  customFrequency: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timesPerWeek: {
      type: Number,
      min: 1,
      max: 7
    }
  },
  target: {
    type: Number,
    min: 1,
    default: 1
  },
  unit: {
    type: String,
    default: 'times'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: '💪'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    time: {
      type: String,
      default: '09:00'
    },
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  stats: {
    totalCompletions: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);
