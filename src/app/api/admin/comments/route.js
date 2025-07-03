import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    let query = {};
    if (status === 'pending') {
      query.approved = false;
    } else if (status === 'approved') {
      query.approved = true;
    }
    
    // Récupérer les commentaires avec les informations du blog associé
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    // Enrichir les commentaires avec les données du blog
    const blogIds = [...new Set(comments.map(comment => comment.blogId))];
    const blogs = await Blog.find({ _id: { $in: blogIds } }, 'title slug').lean();
    
    const blogsMap = blogs.reduce((acc, blog) => {
      acc[blog._id.toString()] = blog;
      return acc;
    }, {});
    
    const enrichedComments = comments.map(comment => ({
      ...comment,
      blog: blogsMap[comment.blogId.toString()] || null
    }));
    
    return NextResponse.json({ comments: enrichedComments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 