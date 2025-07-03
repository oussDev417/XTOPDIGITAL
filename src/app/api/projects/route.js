import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 4;
    const featured = searchParams.get('featured');

    const query = { published: true };
    if (featured === 'true') query.featured = true;

    const projects = await Project.find(query).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 