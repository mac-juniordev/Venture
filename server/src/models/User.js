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

// Hash password only when it has changed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.securityQuestions;
  delete obj.__v;

  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;