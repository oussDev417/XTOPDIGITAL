import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET un commentaire spécifique
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const comment = await Comment.findById(params.id);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - approuver ou rejeter un commentaire
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await req.json();
    
    const updatedComment = await Comment.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );
    
    if (!updatedComment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }
    
    // Mettre à jour le nombre de commentaires approuvés dans le blog
    const approvedComments = await Comment.countDocuments({ 
      blogId: updatedComment.blogId, 
      approved: true 
    });
    
    await Blog.findByIdAndUpdate(
      updatedComment.blogId, 
      { comments: approvedComments }
    );
    
    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - supprimer un commentaire
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const comment = await Comment.findById(params.id);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }
    
    const { blogId } = comment;
    
    await Comment.findByIdAndDelete(params.id);
    
    // Mettre à jour le nombre de commentaires dans le blog
    const approvedComments = await Comment.countDocuments({ 
      blogId, 
      approved: true 
    });
    
    await Blog.findByIdAndUpdate(blogId, { comments: approvedComments });
    
    return NextResponse.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 