import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Récupérer les témoignages publics
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Récupérer les paramètres
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 0;
    
    // Construire la requête
    let query = {};
    
    if (published) {
      query.published = true;
    }
    
    // Récupérer les témoignages triés par ordre
    let testimonialQuery = Testimonial.find(query).sort({ order: 1 });
    
    if (limit > 0) {
      testimonialQuery = testimonialQuery.limit(limit);
    }
    
    const testimonials = await testimonialQuery;
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des témoignages' }, { status: 500 });
  }
} 