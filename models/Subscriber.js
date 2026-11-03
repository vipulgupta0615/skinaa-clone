const { mongoose } = require('../lib/mongodb');

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    source: { type: String, default: 'homepage' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
