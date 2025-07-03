import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Fonction pour créer un slug à partir d'un titre
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// GET tous les projets
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Construire la requête
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    return NextResponse.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - créer un nouveau projet
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
    if (!body.title || !body.description || !body.imgSrc) {
      return NextResponse.json(
        { error: 'Titre, description et image sont requis' },
        { status: 400 }
      );
    }
    
    // Générer un slug à partir du titre si non fourni
    if (!body.slug) {
      body.slug = createSlug(body.title);
    }
    
    // Vérifier si le slug existe déjà
    const existingProject = await Project.findOne({ slug: body.slug });
    if (existingProject) {
      return NextResponse.json(
        { error: 'Un projet avec ce slug existe déjà' },
        { status: 400 }
      );
    }
    
    const newProject = await Project.create(body);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour plusieurs projets (par exemple pour modifier l'ordre ou la publication)
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
    
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: 'Format invalide. Un tableau de projets est attendu' },
        { status: 400 }
      );
    }
    
    const updates = body.projects.map(async (project) => {
      if (!project._id) return null;
      
      return Project.findByIdAndUpdate(
        project._id,
        { $set: { published: project.published, featured: project.featured } },
        { new: true }
      );
    });
    
    const updatedProjects = await Promise.all(updates);
    
    return NextResponse.json({ projects: updatedProjects.filter(project => project !== null) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 