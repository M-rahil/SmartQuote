/**
 * SmartQuote Pricing Engine
 * Rule-based pricing formula leveraging market factors and project parameters
 */

/**
 * Calculate a comprehensive freelance quote
 * @param {Object} rateData - Rate data from MongoDB
 * @param {Object} inputs - User inputs
 * @returns {Object} - Complete pricing breakdown
 */
const calculateQuote = (rateData, inputs) => {
  const {
    experienceLevel,
    country,
    estimatedHours,
    complexity,
    urgency,
    overheadPct = 0.20,
    profitMarginPct = 0.25
  } = inputs;

  // Step 1: Base hourly rate for this skill
  const base = rateData.baseHourlyUSD;

  // Step 2: Adjust for experience level
  const levelMultiplier = rateData.levelMultipliers[experienceLevel] || 1.0;
  const levelAdjusted = base * levelMultiplier;

  // Step 3: Adjust for complexity
  const complexityMultiplier = rateData.complexityMultipliers[complexity] || 1.0;
  const complexityAdjusted = levelAdjusted * complexityMultiplier;

  // Step 4: Adjust for country/market
  const countryMultiplier = rateData.countryMultipliers[country] || rateData.countryMultipliers['OTHER'] || 0.60;
  const countryAdjusted = complexityAdjusted * countryMultiplier;

  // Step 5: Adjust for urgency
  const urgencyMultiplier = rateData.urgencyMultipliers[urgency] || 1.0;
  const urgencyAdjusted = countryAdjusted * urgencyMultiplier;

  // Step 6: Add overhead (tools, software, workspace costs)
  const hourlyWithOverhead = urgencyAdjusted * (1 + overheadPct);

  // Step 7: Add profit margin
  const finalHourly = hourlyWithOverhead * (1 + profitMarginPct);

  // Step 8: Calculate fixed price
  const fixedPrice = finalHourly * estimatedHours;

  // Generate justification paragraph
  const justification = generateJustification({
    skill: rateData.displayName,
    experienceLevel,
    country,
    complexity,
    urgency,
    finalHourly,
    fixedPrice,
    estimatedHours
  });

  return {
    baseHourly: round(base),
    levelAdjusted: round(levelAdjusted),
    complexityAdjusted: round(complexityAdjusted),
    countryAdjusted: round(countryAdjusted),
    urgencyAdjusted: round(urgencyAdjusted),
    hourlyWithOverhead: round(hourlyWithOverhead),
    finalHourly: round(finalHourly),
    fixedPrice: round(fixedPrice),
    multipliers: {
      level: levelMultiplier,
      complexity: complexityMultiplier,
      country: countryMultiplier,
      urgency: urgencyMultiplier
    },
    overheadPct,
    profitMarginPct,
    estimatedHours,
    justification
  };
};

const generateJustification = ({ skill, experienceLevel, country, complexity, urgency, finalHourly, fixedPrice, estimatedHours }) => {
  const levelLabels = {
    junior: 'junior-level',
    mid: 'mid-level',
    senior: 'senior-level',
    expert: 'expert-level'
  };
  const complexityLabels = {
    low: 'straightforward',
    medium: 'moderately complex',
    high: 'highly complex',
    critical: 'mission-critical'
  };
  const urgencyLabels = {
    relaxed: 'a flexible timeline',
    normal: 'a standard timeline',
    urgent: 'an accelerated timeline',
    rush: 'a rush delivery schedule'
  };

  return `This quote reflects ${levelLabels[experienceLevel] || experienceLevel} expertise in ${skill}, calibrated to market rates for ${country}-based professionals. The project is ${complexityLabels[complexity] || complexity} and requires ${urgencyLabels[urgency] || urgency}. Based on an estimate of ${estimatedHours} hours and current market benchmarks, I recommend an hourly rate of $${finalHourly.toFixed(2)} USD, bringing the total project investment to $${fixedPrice.toFixed(2)} USD. This rate incorporates overhead costs, profit margin, and fair compensation for the level of skill and commitment required.`;
};

const round = (value, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

module.exports = { calculateQuote };
