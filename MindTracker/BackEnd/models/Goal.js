const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true,
    maxlength: [200, 'Goal title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'career', 'learning', 'personal', 'financial', 'social', 'other'],
    default: 'personal'
  },
  type: {
    type: String,
    enum: ['habit', 'milestone', 'target', 'challenge'],
    default: 'milestone'
  },
  targetValue: {
    type: Number,
    required: function() {
      return this.type === 'target' || this.type === 'milestone';
    }
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'times'
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  milestones: [{
    title: {
      type: String,
      required: true
    },
    targetValue: {
      type: Number,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  progress: [{
    date: {
      type: Date,
      default: Date.now
    },
    value: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  color: {
    type: String,
    default: '#10B981'
  },
  icon: {
    type: String,
    default: '🎯'
  }
}, {
  timestamps: true
});

// Index for efficient queries
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, deadline: 1 });
goalSchema.index({ user: 1, createdAt: -1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetValue && this.targetValue > 0) {
    return Math.min(Math.round((this.currentValue / this.targetValue) * 100), 100);
  }
  return 0;
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

module.exports = mongoose.model('Goal', goalSchema);
