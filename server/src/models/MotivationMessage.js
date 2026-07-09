import mongoose from 'mongoose';

const motivationMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    author: {
      type: String,
      default: 'VENTURE',
      trim: true,
    },
    category: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'grind', 'mindset', 'weekend', 'custom'],
      default: 'mindset',
    },
    timeOfDay: {
      type: String,
      enum: ['any', 'morning', 'afternoon', 'evening', 'night'],
      default: 'any',
    },
    scheduledDate: {
      type: Date,
      default: null, // null means available any day
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Get a random message based on time of day
motivationMessageSchema.statics.getRandomMessage = async function () {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay = 'any';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  // Check if weekend
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;

  // Find messages matching current time or 'any'
  const messages = await this.find({
    isActive: true,
    $or: [
      { timeOfDay },
      { timeOfDay: 'any' },
    ],
  }).sort({ priority: -1 });

  if (messages.length === 0) {
    return {
      message: "Time is moving. What are you building?",
      author: "VENTURE",
      category: "default",
    };
  }

  // Pick random from available messages
  const random = messages[Math.floor(Math.random() * messages.length)];
  return {
    message: random.message,
    author: random.author,
    category: random.category,
  };
};

// Get messages by category
motivationMessageSchema.statics.getByCategory = async function (category) {
  return this.find({ category, isActive: true }).sort({ priority: -1 });
};

const MotivationMessage = mongoose.model('MotivationMessage', motivationMessageSchema);

export default MotivationMessage;