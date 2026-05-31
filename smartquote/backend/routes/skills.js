const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');

// GET /api/skills
router.get('/skills', async (req, res, next) => {
  try {
    const rates = await Rate.find({}, 'skill displayName category baseHourlyUSD').sort({ category: 1, displayName: 1 });
    res.json({ skills: rates });
  } catch (err) {
    next(err);
  }
});

// GET /api/rates/:skill
router.get('/rates/:skill', async (req, res, next) => {
  try {
    const rate = await Rate.findOne({ skill: req.params.skill.toLowerCase() });
    if (!rate) {
      return res.status(404).json({ error: 'Skill not found.' });
    }
    res.json({ rate });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
