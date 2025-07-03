import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Fonction pour créer un slug à partir d'un titre
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// GET tous les blogs
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments();
    
    return NextResponse.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - créer un nouveau blog
export async function POST(req) {
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
    if (!body.title || !body.content || !body.imgSrc) {
      return NextResponse.json(
        { error: 'Titre, contenu et image sont requis' },
        { status: 400 }
      );
    }
    
    // Générer un slug à partir du titre si non fourni
    if (!body.slug) {
      body.slug = createSlug(body.title);
    }
    
    // Vérifier si le slug existe déjà
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'Un blog avec ce slug existe déjà' },
        { status: 400 }
      );
    }
    
    const newBlog = await Blog.create(body);
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour plusieurs blogs (par exemple pour modifier l'ordre ou la publication)
export async function PUT(req) {
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
    
    if (!body.blogs || !Array.isArray(body.blogs)) {
      return NextResponse.json(
        { error: 'Format invalide. Un tableau de blogs est attendu' },
        { status: 400 }
      );
    }
    
    const updates = body.blogs.map(async (blog) => {
      if (!blog._id) return null;
      
      return Blog.findByIdAndUpdate(
        blog._id,
        { $set: { published: blog.published } },
        { new: true }
      );
    });
    
    const updatedBlogs = await Promise.all(updates);
    
    return NextResponse.json({ blogs: updatedBlogs.filter(blog => blog !== null) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 