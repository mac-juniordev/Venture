import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },

    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },

    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },

    avatar: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },

    website: {
      type: String,
      maxlength: [200, 'Website URL cannot exceed 200 characters'],
    },

    github: {
      type: String,
      maxlength: [100, 'GitHub username cannot exceed 100 characters'],
    },

    twitter: {
      type: String,
      maxlength: [100, 'Twitter username cannot exceed 100 characters'],
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    totalCheckIns: {
      type: Number,
      default: 0,
    },

    challengesCompleted: {
      type: Number,
      default: 0,
    },

    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Virtual field
profileSchema.virtual('currentStreak').get(function () {
  // Calculated later by streak service
  return 0;
});


// Normalize username before saving
profileSchema.pre('save', function () {
  if (this.username) {
    this.username = this.username.toLowerCase();
  }
});


const Profile = mongoose.model('Profile', profileSchema);

export default Profile;