import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Récupérer toutes les catégories uniques avec leur nombre d'occurrences
    const categoriesArray = await Blog.aggregate([
      { $match: { published: true } },
      { $unwind: "$categories" },
      { 
        $group: { 
          _id: "$categories", 
          count: { $sum: 1 } 
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Formater les résultats
    const categories = categoriesArray.map(item => ({
      name: item._id,
      count: item.count
    }));
    
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 