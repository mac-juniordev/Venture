import Plan from '../models/Plan.js';

export const seedPlans = async () => {
  const count = await Plan.countDocuments();
  if (count > 0) return;

  await Plan.insertMany([
    {
      name: 'explorer',
      displayName: 'Explorer',
      description: 'Start your growth journey',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { name: 'Daily check-ins & streaks', limit: null },
        { name: 'Basic growth tracking', limit: null },
        { name: 'Join up to 3 challenges', limit: 3 },
        { name: 'Community reactions', limit: null },
        { name: 'Achievement badges', limit: null },
        { name: 'Leaderboard access', limit: null },
      ],
    },
    {
      name: 'builder',
      displayName: 'Builder',
      description: 'Accelerate your growth',
      monthlyPrice: 9,
      yearlyPrice: 7,
      features: [
        { name: 'Everything in Explorer', limit: null },
        { name: 'Unlimited challenges', limit: null },
        { name: 'Create custom challenges', limit: null },
        { name: 'Advanced analytics', limit: null },
        { name: 'Export growth reports', limit: null },
        { name: 'Ad-free experience', limit: null },
      ],
    },
    {
      name: 'visionary',
      displayName: 'Visionary',
      description: 'Complete ecosystem',
      monthlyPrice: 19,
      yearlyPrice: 15,
      features: [
        { name: 'Everything in Builder', limit: null },
        { name: 'Custom branding', limit: null },
        { name: 'Team challenges', limit: null },
        { name: 'API access', limit: null },
        { name: 'Priority support 24/7', limit: null },
        { name: 'Monthly coaching calls', limit: null },
      ],
    },
  ]);
  console.log('Plans seeded');
};