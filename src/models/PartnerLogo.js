import mongoose from 'mongoose';

const PartnerLogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

let PartnerLogo;
try {
  PartnerLogo = mongoose.model('PartnerLogo');
} catch (e) {
  PartnerLogo = mongoose.model('PartnerLogo', PartnerLogoSchema);
}

export default PartnerLogo; 