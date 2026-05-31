const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Quote'
  },
  clientName: {
    type: String,
    default: ''
  },
  inputs: {
    skill: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    country: { type: String, required: true },
    estimatedHours: { type: Number, required: true },
    complexity: { type: String, required: true },
    urgency: { type: String, required: true },
    overheadPct: { type: Number, required: true },
    profitMarginPct: { type: Number, required: true }
  },
  result: {
    baseHourly: Number,
    levelAdjusted: Number,
    complexityAdjusted: Number,
    countryAdjusted: Number,
    urgencyAdjusted: Number,
    hourlyWithOverhead: Number,
    finalHourly: Number,
    fixedPrice: Number,
    multipliers: {
      level: Number,
      complexity: Number,
      country: Number,
      urgency: Number
    },
    currency: String,
    justification: String
  },
  status: {
    type: String,
    enum: ['draft', 'saved', 'sent', 'accepted', 'rejected'],
    default: 'saved'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast user queries
quoteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
