const { mongoose } = require('../lib/mongodb');

const routineSchema = new mongoose.Schema(
  {
    timeOfDay: { type: String, enum: ['AM', 'PM'], required: true },
    steps: [{ type: String, required: true }],
    total: { type: Number, required: true, min: 0 },
    email: { type: String, lowercase: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Routine || mongoose.model('Routine', routineSchema);
