import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'motivation', 'challenge', 'achievement', 'notification', 'security'],
      default: 'general',
    },
    description: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get a setting by key
systemSettingSchema.statics.getSetting = async function (key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set a setting
systemSettingSchema.statics.setSetting = async function (key, value, updatedBy = null) {
  const setting = await this.findOneAndUpdate(
    { key },
    { 
      value,
      ...(updatedBy && { updatedBy }),
    },
    { 
      new: true, 
      upsert: true, 
      runValidators: true 
    }
  );
  return setting;
};

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);

export default SystemSetting;