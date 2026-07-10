import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const securityQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answerHash: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    securityQuestions: [securityQuestionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deactivated', 'archived'],
      default: 'active',
    },
    suspensionEndDate: {
      type: Date,
      default: null,
    },
    suspensionReason: {
      type: String,
      enum: ['user_requested', 'admin_action', 'inactivity', null],
      default: null,
    },
    deactivatedAt: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when returning user data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.securityQuestions;
  delete obj.__v;

  return obj;
};

// Seed Architect account
userSchema.statics.seedArchitect = async function () {
  const architectEmail =
    process.env.ARCHITECT_EMAIL || 'architect@venture.com';
  const architectPassword =
    process.env.ARCHITECT_PASSWORD || 'Architect@2026!';

  let architect = await this.findOne({ email: architectEmail });

  if (!architect) {
    architect = await this.create({
      email: architectEmail,
      password: architectPassword,
      role: 'admin',
      accountStatus: 'active',
    });

    console.log('Architect account seeded successfully');
  } else if (architect.role !== 'admin') {
    architect.role = 'admin';
    await architect.save();

    console.log('Architect role updated for existing user');
  }

  return architect;
};

const User = mongoose.model('User', userSchema);

export default User;