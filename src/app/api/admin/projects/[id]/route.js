import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET un projet spécifique par ID
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour un projet
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
    
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    // Si le slug est modifié, vérifier que le nouveau slug n'existe pas déjà
    if (body.slug && body.slug !== project.slug) {
      const existingProject = await Project.findOne({ slug: body.slug });
      if (existingProject && existingProject._id.toString() !== params.id) {
        return NextResponse.json(
          { error: 'Un projet avec ce slug existe déjà' },
          { status: 400 }
        );
      }
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - supprimer un projet
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
    
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    await Project.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 