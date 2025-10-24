const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mood: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible']
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  stress: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  sleep: {
    hours: {
      type: Number,
      min: 0,
      max: 24
    },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  },
  activities: [{
    type: String,
    enum: ['exercise', 'work', 'social', 'hobby', 'relaxation', 'learning', 'family', 'other']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }]
}, {
  timestamps: true
});

// Index for efficient queries
moodSchema.index({ user: 1, date: -1 });
moodSchema.index({ user: 1, date: -1 }, { unique: true });

// Virtual for formatted date
moodSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('Mood', moodSchema);
