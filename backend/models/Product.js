const { mongoose } = require('../lib/mongodb');

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    shopUrl: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
