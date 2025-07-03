import mongoose from 'mongoose';

const PricingPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Veuillez fournir un titre'],
    },
    price: {
      type: String, // ex: '$99'
      required: [true, 'Veuillez fournir un prix'],
    },
    period: {
      type: String,
      default: 'Per year',
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

let PricingPlan;
try {
  PricingPlan = mongoose.model('PricingPlan');
} catch (e) {
  PricingPlan = mongoose.model('PricingPlan', PricingPlanSchema);
}

export default PricingPlan; 