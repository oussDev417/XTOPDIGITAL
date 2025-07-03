import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET un blog spécifique
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour un blog
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
    
    // Validation de base
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Titre et contenu sont requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si le slug existe déjà pour un autre blog
    if (body.slug) {
      const existingBlog = await Blog.findOne({
        slug: body.slug,
        _id: { $ne: params.id }
      });
      
      if (existingBlog) {
        return NextResponse.json(
          { error: 'Un blog avec ce slug existe déjà' },
          { status: 400 }
        );
      }
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - supprimer un blog
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
    
    const deletedBlog = await Blog.findByIdAndDelete(params.id);
    
    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Blog supprimé avec succès' }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 