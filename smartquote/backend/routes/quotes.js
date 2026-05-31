const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const Rate = require('../models/Rate');
const { protect } = require('../middleware/auth');
const { calculateQuote } = require('../utils/pricingEngine');
const { generateProposalPDF } = require('../utils/pdfGenerator');

// POST /api/quote - Calculate a quote (no auth required)
router.post('/quote', async (req, res, next) => {
  try {
    const { skill, experienceLevel, country, estimatedHours, complexity, urgency, overheadPct, profitMarginPct } = req.body;

    if (!skill || !experienceLevel || !country || !estimatedHours || !complexity || !urgency) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const rate = await Rate.findOne({ skill: skill.toLowerCase() });
    if (!rate) {
      return res.status(404).json({ error: 'Skill rate not found.' });
    }

    const result = calculateQuote(rate, {
      experienceLevel,
      country,
      estimatedHours: parseFloat(estimatedHours),
      complexity,
      urgency,
      overheadPct: overheadPct !== undefined ? parseFloat(overheadPct) : 0.20,
      profitMarginPct: profitMarginPct !== undefined ? parseFloat(profitMarginPct) : 0.25
    });

    res.json({ result, skillData: { displayName: rate.displayName, category: rate.category } });
  } catch (err) {
    next(err);
  }
});

// POST /api/quote/save - Save a quote (auth required)
router.post('/quote/save', protect, async (req, res, next) => {
  try {
    const { title, clientName, inputs, result, notes } = req.body;

    const quote = await Quote.create({
      userId: req.user._id,
      title: title || `Quote - ${inputs.skill} - ${new Date().toLocaleDateString()}`,
      clientName,
      inputs,
      result,
      notes
    });

    res.status(201).json({ quote });
  } catch (err) {
    next(err);
  }
});

// GET /api/quote/:id - Get single quote
router.get('/quote/:id', protect, async (req, res, next) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found.' });
    }
    res.json({ quote });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/quote/:id
router.delete('/quote/:id', protect, async (req, res, next) => {
  try {
    const quote = await Quote.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found.' });
    }
    res.json({ message: 'Quote deleted.' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/quote/:id/status
router.patch('/quote/:id/status', protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    const quote = await Quote.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ error: 'Quote not found.' });
    res.json({ quote });
  } catch (err) {
    next(err);
  }
});

// GET /api/user/quotes - Get all quotes for current user
router.get('/user/quotes', protect, async (req, res, next) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);

    // Analytics aggregation
    const total = quotes.length;
    const totalValue = quotes.reduce((sum, q) => sum + (q.result?.fixedPrice || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;

    // Skill distribution
    const skillCounts = {};
    quotes.forEach(q => {
      const skill = q.inputs?.skill || 'unknown';
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    // Status distribution
    const statusCounts = {};
    quotes.forEach(q => {
      statusCounts[q.status] = (statusCounts[q.status] || 0) + 1;
    });

    // Monthly trend (last 6 months)
    const now = new Date();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const count = quotes.filter(q => {
        const qd = new Date(q.createdAt);
        return qd.getMonth() === d.getMonth() && qd.getFullYear() === d.getFullYear();
      }).length;
      monthlyTrend.push({ month: monthStr, count });
    }

    res.json({
      quotes,
      analytics: {
        total,
        totalValue: Math.round(totalValue),
        avgValue: Math.round(avgValue),
        skillCounts,
        statusCounts,
        monthlyTrend
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/quote/:id/pdf - Generate PDF for a quote
router.post('/quote/:id/pdf', protect, async (req, res, next) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quote) return res.status(404).json({ error: 'Quote not found.' });

    const pdfBuffer = await generateProposalPDF(quote, req.user);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="SmartQuote-${quote._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
