import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// Récupérer tous les témoignages
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Récupérer les paramètres de recherche et pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Construire la requête
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Utiliser le modèle mongoose au lieu de la connexion directe à la collection
    const db = mongoose.connection.db;
    
    // Récupérer les témoignages triés par ordre
    const testimonials = await db.collection('testimonials')
      .find(query)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Compter le nombre total de témoignages pour la pagination
    const total = await db.collection('testimonials').countDocuments(query);
    
    return NextResponse.json({
      testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des témoignages' }, { status: 500 });
  }
}

// Créer un nouveau témoignage
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const testimonialData = await request.json();
    
    // Validation des données
    if (!testimonialData.name || !testimonialData.role || !testimonialData.content) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires' }, { status: 400 });
    }
    
    await connectToDatabase();
    const db = mongoose.connection.db;
    
    // Déterminer le prochain ordre automatiquement si non spécifié
    let order = testimonialData.order;
    if (order === undefined || order === null) {
      const lastTestimonial = await db.collection('testimonials')
        .find({})
        .sort({ order: -1 })
        .limit(1)
        .toArray();
      
      order = lastTestimonial.length > 0 ? lastTestimonial[0].order + 1 : 0;
    }
    
    // Préparation des données à insérer
    const newTestimonial = {
      name: testimonialData.name,
      role: testimonialData.role,
      content: testimonialData.content,
      rating: parseInt(testimonialData.rating || 5, 10),
      imgSrc: testimonialData.imgSrc || '',
      published: testimonialData.published === undefined ? true : testimonialData.published,
      order: parseInt(order, 10),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('testimonials').insertOne(newTestimonial);
    
    return NextResponse.json({ 
      message: 'Témoignage créé avec succès',
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du témoignage' }, { status: 500 });
  }
}

// PUT - mettre à jour plusieurs témoignages (par exemple pour modifier l'ordre ou la publication)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    await connectToDatabase();
    const db = mongoose.connection.db;
    
    const body = await request.json();
    
    if (!body.testimonials || !Array.isArray(body.testimonials)) {
      return NextResponse.json(
        { error: 'Format invalide. Un tableau de témoignages est attendu' },
        { status: 400 }
      );
    }
    
    const updateOperations = body.testimonials.map(async (testimonial) => {
      if (!testimonial._id || !ObjectId.isValid(testimonial._id)) return null;
      
      return db.collection('testimonials').updateOne(
        { _id: new ObjectId(testimonial._id) },
        { 
          $set: { 
            published: testimonial.published, 
            order: testimonial.order,
            updatedAt: new Date()
          } 
        }
      );
    });
    
    await Promise.all(updateOperations);
    
    return NextResponse.json({ 
      message: 'Témoignages mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des témoignages:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des témoignages' }, { status: 500 });
  }
} 