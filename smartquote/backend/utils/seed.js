require('dotenv').config();
const mongoose = require('mongoose');
const Rate = require('../models/Rate');

const seedData = [
  {
    skill: 'web-development',
    displayName: 'Web Development',
    category: 'Development',
    baseHourlyUSD: 75,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.55, expert: 2.3 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.4, critical: 1.8 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.3, rush: 1.65 }
  },
  {
    skill: 'mobile-development',
    displayName: 'Mobile Development',
    category: 'Development',
    baseHourlyUSD: 85,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.6, expert: 2.4 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.45, critical: 1.85 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.3, rush: 1.65 }
  },
  {
    skill: 'ui-ux-design',
    displayName: 'UI/UX Design',
    category: 'Design',
    baseHourlyUSD: 65,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.45, expert: 2.1 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.3, critical: 1.65 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.25, rush: 1.55 }
  },
  {
    skill: 'graphic-design',
    displayName: 'Graphic Design',
    category: 'Design',
    baseHourlyUSD: 50,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.4, expert: 2.0 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.25, critical: 1.6 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.2, rush: 1.5 }
  },
  {
    skill: 'data-science',
    displayName: 'Data Science',
    category: 'Data',
    baseHourlyUSD: 90,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.6, expert: 2.4 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.45, critical: 1.9 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.3, rush: 1.65 }
  },
  {
    skill: 'machine-learning',
    displayName: 'Machine Learning',
    category: 'Data',
    baseHourlyUSD: 110,
    levelMultipliers: { junior: 0.6, mid: 1.0, senior: 1.65, expert: 2.5 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.5, critical: 2.0 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.35, rush: 1.7 }
  },
  {
    skill: 'copywriting',
    displayName: 'Copywriting',
    category: 'Writing',
    baseHourlyUSD: 45,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.4, expert: 1.9 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.25, critical: 1.6 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.2, rush: 1.5 }
  },
  {
    skill: 'seo',
    displayName: 'SEO',
    category: 'Marketing',
    baseHourlyUSD: 55,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.45, expert: 2.0 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.3, critical: 1.65 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.25, rush: 1.55 }
  },
  {
    skill: 'digital-marketing',
    displayName: 'Digital Marketing',
    category: 'Marketing',
    baseHourlyUSD: 55,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.4, expert: 1.95 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.3, critical: 1.65 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.25, rush: 1.5 }
  },
  {
    skill: 'devops',
    displayName: 'DevOps / Cloud',
    category: 'Development',
    baseHourlyUSD: 95,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.55, expert: 2.3 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.45, critical: 1.9 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.35, rush: 1.7 }
  },
  {
    skill: 'blockchain',
    displayName: 'Blockchain Development',
    category: 'Development',
    baseHourlyUSD: 120,
    levelMultipliers: { junior: 0.6, mid: 1.0, senior: 1.7, expert: 2.6 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.5, critical: 2.0 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.4, rush: 1.8 }
  },
  {
    skill: 'cybersecurity',
    displayName: 'Cybersecurity',
    category: 'Consulting',
    baseHourlyUSD: 100,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.6, expert: 2.4 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.5, critical: 2.0 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.4, rush: 1.8 }
  },
  {
    skill: 'video-editing',
    displayName: 'Video Editing',
    category: 'Design',
    baseHourlyUSD: 55,
    levelMultipliers: { junior: 0.7, mid: 1.0, senior: 1.4, expert: 2.0 },
    complexityMultipliers: { low: 0.85, medium: 1.0, high: 1.3, critical: 1.65 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.25, rush: 1.55 }
  },
  {
    skill: 'business-consulting',
    displayName: 'Business Consulting',
    category: 'Consulting',
    baseHourlyUSD: 100,
    levelMultipliers: { junior: 0.65, mid: 1.0, senior: 1.55, expert: 2.3 },
    complexityMultipliers: { low: 0.8, medium: 1.0, high: 1.4, critical: 1.85 },
    urgencyMultipliers: { relaxed: 0.9, normal: 1.0, urgent: 1.3, rush: 1.65 }
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Rate.deleteMany({});
    const rates = await Rate.insertMany(seedData);
    console.log(`Seeded ${rates.length} skill rates`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
