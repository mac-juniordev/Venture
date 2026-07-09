import MotivationMessage from '../models/MotivationMessage.js';

export const seedMotivationMessages = async () => {
  const count = await MotivationMessage.countDocuments();
  if (count > 0) return;

  const messages = [
    // Morning
    { message: "Today is a blank canvas. Paint something extraordinary.", author: "VENTURE", category: "morning", timeOfDay: "morning", priority: 5 },
    { message: "The early builder catches the momentum. Start strong.", author: "VENTURE", category: "morning", timeOfDay: "morning", priority: 4 },
    { message: "Morning consistency is the foundation of greatness.", author: "VENTURE", category: "morning", timeOfDay: "morning", priority: 3 },
    
    // Afternoon
    { message: "The grind doesn't stop. Keep pushing forward.", author: "VENTURE", category: "afternoon", timeOfDay: "afternoon", priority: 5 },
    { message: "Afternoon momentum. Don't let the energy dip.", author: "VENTURE", category: "afternoon", timeOfDay: "afternoon", priority: 4 },
    
    // Evening
    { message: "Reflect on today's progress. Tomorrow starts now.", author: "VENTURE", category: "evening", timeOfDay: "evening", priority: 5 },
    { message: "The night is for planning tomorrow's victory.", author: "VENTURE", category: "evening", timeOfDay: "evening", priority: 4 },
    
    // Grind
    { message: "Greatness is not born. It's built, one day at a time.", author: "VENTURE", category: "grind", timeOfDay: "any", priority: 8 },
    { message: "Suffer the pain of discipline or the pain of regret.", author: "VENTURE", category: "grind", timeOfDay: "any", priority: 7 },
    { message: "The only way to fail is to stop showing up.", author: "VENTURE", category: "grind", timeOfDay: "any", priority: 6 },
    { message: "Your future self is watching. Make them proud.", author: "VENTURE", category: "grind", timeOfDay: "any", priority: 6 },
    { message: "Nobody cares about your excuses. Show your results.", author: "VENTURE", category: "grind", timeOfDay: "any", priority: 5 },
    
    // Mindset
    { message: "Progress, not perfection. Every step counts.", author: "VENTURE", category: "mindset", timeOfDay: "any", priority: 8 },
    { message: "You are the sum of your daily habits.", author: "VENTURE", category: "mindset", timeOfDay: "any", priority: 7 },
    { message: "Consistency beats intensity. Keep showing up.", author: "VENTURE", category: "mindset", timeOfDay: "any", priority: 7 },
    { message: "Small daily improvements lead to stunning results.", author: "VENTURE", category: "mindset", timeOfDay: "any", priority: 6 },
    { message: "Your streak is proof of your dedication. Protect it.", author: "VENTURE", category: "mindset", timeOfDay: "any", priority: 5 },
    
    // Weekend
    { message: "Weekends are for builders too. Stay consistent.", author: "VENTURE", category: "weekend", timeOfDay: "any", priority: 5 },
    { message: "Champions don't take weekends off from their dreams.", author: "VENTURE", category: "weekend", timeOfDay: "any", priority: 4 },
  ];

  await MotivationMessage.insertMany(messages);
  console.log('Motivation messages seeded successfully');
};