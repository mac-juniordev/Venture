import User from '../models/User.js';

// Check and process expired suspensions
export const processSuspensions = async () => {
  const now = new Date();
  
  // Find users whose suspension has expired
  const expired = await User.find({
    accountStatus: 'suspended',
    suspensionEndDate: { $lte: now },
  });

  for (const user of expired) {
    user.accountStatus = 'archived';
    user.suspensionEndDate = null;
    await user.save();
    console.log(`User ${user.email} archived due to expired suspension`);
  }

  return expired.length;
};