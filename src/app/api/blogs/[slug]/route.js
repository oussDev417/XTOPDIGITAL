import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const { slug } = params;
    
    const blog = await Blog.findOne({ slug, published: true });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ blog });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 