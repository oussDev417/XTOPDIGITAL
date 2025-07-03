import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Veuillez fournir un titre'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Veuillez fournir une description'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu détaillé'],
    },
    icon: {
      type: String,
      required: [true, 'Veuillez fournir une icône'],
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
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
let Service;
try {
  Service = mongoose.model('Service');
} catch (e) {
  Service = mongoose.model('Service', ServiceSchema);
}

export default Service; 