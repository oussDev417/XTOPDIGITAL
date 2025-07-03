import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import { Types } from 'mongoose';

// Récupérer les détails d'un service par son slug ou son ID
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    await connectToDatabase();
    
    // Construire la requête pour chercher soit par slug, soit par ID
    let query = { slug: slug };
    
    // Si le slug ressemble à un ObjectId MongoDB, essayons aussi ça
    if (Types.ObjectId.isValid(slug)) {
      query = { 
        $or: [
          { slug: slug },
          { _id: new Types.ObjectId(slug) }
        ]
      };
    }
    
    // Ajouter la condition de publication
    query.published = true;
    
    // Récupérer le service
    const service = await Service.findOne(query);
    
    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du service' }, { status: 500 });
  }
} 