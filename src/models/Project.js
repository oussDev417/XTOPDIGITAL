import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, 'Veuillez fournir une catégorie'],
    },
    description: {
      type: String,
      required: [true, 'Veuillez fournir une description'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu détaillé'],
    },
    client: {
      type: String,
      required: [true, 'Veuillez fournir un nom de client'],
    },
    date: {
      type: Date,
      required: [true, 'Veuillez fournir une date'],
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image principale'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Verification plus stricte pour éviter l'erreur avec mongoose.models
let Project;
try {
  Project = mongoose.model('Project');
} catch (e) {
  Project = mongoose.model('Project', ProjectSchema);
}

export default Project; 