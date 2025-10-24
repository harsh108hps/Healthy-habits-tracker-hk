const mongoose = require('mongoose');

const habitEntrySchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
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
  completed: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    default: 'good'
  },
  difficulty: {
    type: String,
    enum: ['very_easy', 'easy', 'moderate', 'hard', 'very_hard'],
    default: 'moderate'
  },
  timeSpent: {
    type: Number, // in minutes
    min: 0
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
habitEntrySchema.index({ user: 1, date: -1 });
habitEntrySchema.index({ habit: 1, date: -1 });
habitEntrySchema.index({ user: 1, habit: 1, date: -1 }, { unique: true });

// Virtual for formatted date
habitEntrySchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('HabitEntry', habitEntrySchema);
