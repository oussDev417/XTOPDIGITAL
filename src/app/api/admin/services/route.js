import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// Fonction pour créer un slug à partir d'un titre
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// GET tous les services
export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const services = await Service.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Service.countDocuments();
    
    return NextResponse.json({
      services,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - créer un nouveau service
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
    if (!body.title || !body.description || !body.icon || !body.imgSrc) {
      return NextResponse.json(
        { error: 'Titre, description, icône et image sont requis' },
        { status: 400 }
      );
    }
    
    // Générer un slug à partir du titre si non fourni
    if (!body.slug) {
      body.slug = createSlug(body.title);
    }
    
    // Vérifier si le slug existe déjà
    const existingService = await Service.findOne({ slug: body.slug });
    if (existingService) {
      return NextResponse.json(
        { error: 'Un service avec ce slug existe déjà' },
        { status: 400 }
      );
    }
    
    // Déterminer l'ordre du nouveau service
    if (body.order === undefined) {
      const lastService = await Service.findOne().sort({ order: -1 });
      body.order = lastService ? lastService.order + 1 : 0;
    }
    
    const newService = await Service.create(body);
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour l'ordre de plusieurs services
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
    
    if (!body.services || !Array.isArray(body.services)) {
      return NextResponse.json(
        { error: 'Format invalide. Un tableau de services est attendu' },
        { status: 400 }
      );
    }
    
    const updates = body.services.map(async (service) => {
      if (!service._id) return null;
      
      return Service.findByIdAndUpdate(
        service._id,
        { $set: { order: service.order, published: service.published } },
        { new: true }
      );
    });
    
    const updatedServices = await Promise.all(updates);
    
    return NextResponse.json({ services: updatedServices.filter(service => service !== null) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 