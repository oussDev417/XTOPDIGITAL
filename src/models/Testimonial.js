import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Veuillez fournir un rôle ou une entreprise'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu'],
      maxlength: [500, 'Le contenu ne peut pas dépasser 500 caractères'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Verification plus stricte pour éviter l'erreur avec mongoose.models
let Testimonial;
try {
  Testimonial = mongoose.model('Testimonial');
} catch (e) {
  Testimonial = mongoose.model('Testimonial', TestimonialSchema);
}

export default Testimonial; 