import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu'],
    },
    excerpt: {
      type: String,
      required: [true, 'Veuillez fournir un extrait'],
      maxlength: [200, 'L\'extrait ne peut pas dépasser 200 caractères'],
    },
    author: {
      type: String,
      required: [true, 'Veuillez fournir un auteur'],
    },
    categories: {
      type: [String],
      default: ['Non catégorisé'],
    },
    comments: {
      type: Number,
      default: 0,
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    published: {
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
let Blog;
try {
  Blog = mongoose.model('Blog');
} catch (e) {
  Blog = mongoose.model('Blog', BlogSchema);
}

export default Blog; 