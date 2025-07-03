import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');
    
    if (!blogId) {
      return NextResponse.json(
        { error: 'ID du blog requis' },
        { status: 400 }
      );
    }
    
    const comments = await Comment.find({ 
      blogId, 
      approved: true 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Validation de base
    if (!body.name || !body.email || !body.message || !body.blogId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si le blog existe
    const blog = await Blog.findById(body.blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog non trouvé' },
        { status: 404 }
      );
    }
    
    // Par défaut, les commentaires sont en attente de modération
    const newComment = await Comment.create({
      ...body,
      approved: false
    });
    
    // Mettre à jour le nombre de commentaires dans le blog (incluant ceux non approuvés)
    const commentCount = await Comment.countDocuments({ blogId: body.blogId });
    await Blog.findByIdAndUpdate(body.blogId, { comments: commentCount });
    
    return NextResponse.json(
      { message: 'Commentaire soumis et en attente de modération' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 