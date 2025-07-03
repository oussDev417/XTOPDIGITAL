import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const { slug } = params;
    const project = await Project.findOne({ slug, published: true });
    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 