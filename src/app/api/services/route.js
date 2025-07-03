import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';

// Récupérer les services publics
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Récupérer les paramètres
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false'; // Par défaut true
    const limit = parseInt(searchParams.get('limit')) || 0;
    const page = parseInt(searchParams.get('page')) || 1;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    
    // Construire la requête
    let query = {};
    
    if (published) {
      query.published = true;
    }
    
    if (featured) {
      query.featured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    // Compter le nombre total de services correspondant à la requête
    const total = await Service.countDocuments(query);
    
    // Calculer le décalage pour la pagination
    const skip = (page - 1) * limit;
    
    // Récupérer les services triés par ordre
    let servicesQuery = Service.find(query).sort({ order: 1 });
    
    // Appliquer pagination si limit > 0
    if (limit > 0) {
      servicesQuery = servicesQuery.skip(skip).limit(limit);
    }
    
    const services = await servicesQuery;
    
    return NextResponse.json({
      services,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des services' }, { status: 500 });
  }
} 