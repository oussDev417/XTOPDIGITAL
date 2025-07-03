import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'L\'ID du blog est requis'],
    },
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir un email valide',
      ],
    },
    message: {
      type: String,
      required: [true, 'Le message est requis'],
      maxlength: [1000, 'Le message ne peut pas dépasser 1000 caractères'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Vérification plus stricte pour éviter l'erreur avec mongoose.models
let Comment;
try {
  Comment = mongoose.model('Comment');
} catch (e) {
  Comment = mongoose.model('Comment', CommentSchema);
}

export default Comment; 