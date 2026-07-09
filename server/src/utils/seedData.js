import SystemSetting from '../models/SystemSetting.js';

export const seedSystemSettings = async () => {
  const defaultSettings = [
    {
      key: 'platform_name',
      value: 'VENTURE',
      category: 'general',
      description: 'Platform display name',
      isPublic: true,
    },
    {
      key: 'platform_tagline',
      value: 'The Journey of Growth',
      category: 'general',
      description: 'Platform tagline',
      isPublic: true,
    },
    {
      key: 'daily_motivation_message',
      value: 'Time is moving. What are you building?',
      category: 'motivation',
      description: 'Default daily motivation message shown on dashboard',
      isPublic: true,
    },
    {
      key: 'max_challenge_participants',
      value: 100,
      category: 'challenge',
      description: 'Maximum participants per challenge',
      isPublic: false,
    },
    {
      key: 'streak_grace_period_hours',
      value: 24,
      category: 'general',
      description: 'Hours allowed before streak breaks',
      isPublic: false,
    },
    {
      key: 'min_password_length',
      value: 8,
      category: 'security',
      description: 'Minimum password length for users',
      isPublic: false,
    },
    {
      key: 'max_bio_length',
      value: 300,
      category: 'general',
      description: 'Maximum characters for user bio',
      isPublic: true,
    },
    {
      key: 'maintenance_mode',
      value: false,
      category: 'general',
      description: 'Enable maintenance mode',
      isPublic: false,
    },
  ];

  for (const setting of defaultSettings) {
    await SystemSetting.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: setting },
      { upsert: true, new: true }
    );
  }

  console.log('System settings seeded successfully');
};