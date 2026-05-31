const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Development', 'Design', 'Marketing', 'Writing', 'Data', 'Consulting', 'Other']
  },
  baseHourlyUSD: {
    type: Number,
    required: true
  },
  levelMultipliers: {
    junior: { type: Number, default: 0.7 },
    mid: { type: Number, default: 1.0 },
    senior: { type: Number, default: 1.5 },
    expert: { type: Number, default: 2.2 }
  },
  complexityMultipliers: {
    low: { type: Number, default: 0.8 },
    medium: { type: Number, default: 1.0 },
    high: { type: Number, default: 1.35 },
    critical: { type: Number, default: 1.75 }
  },
  urgencyMultipliers: {
    relaxed: { type: Number, default: 0.9 },
    normal: { type: Number, default: 1.0 },
    urgent: { type: Number, default: 1.25 },
    rush: { type: Number, default: 1.6 }
  },
  countryMultipliers: {
    US: { type: Number, default: 1.0 },
    CA: { type: Number, default: 0.92 },
    GB: { type: Number, default: 0.95 },
    AU: { type: Number, default: 0.88 },
    DE: { type: Number, default: 0.90 },
    FR: { type: Number, default: 0.88 },
    IN: { type: Number, default: 0.35 },
    BR: { type: Number, default: 0.40 },
    PK: { type: Number, default: 0.28 },
    PH: { type: Number, default: 0.32 },
    NG: { type: Number, default: 0.30 },
    UA: { type: Number, default: 0.45 },
    PL: { type: Number, default: 0.55 },
    MX: { type: Number, default: 0.42 },
    ZA: { type: Number, default: 0.38 },
    OTHER: { type: Number, default: 0.60 }
  }
});

module.exports = mongoose.model('Rate', rateSchema);
