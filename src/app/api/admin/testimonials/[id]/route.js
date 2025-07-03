import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Récupérer un témoignage par ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de témoignage invalide' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const testimonial = await db.collection('testimonials').findOne(
      { _id: new ObjectId(id) }
    );
    
    if (!testimonial) {
      return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Erreur lors de la récupération du témoignage:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du témoignage' }, { status: 500 });
  }
}

// Mettre à jour un témoignage par ID
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de témoignage invalide' }, { status: 400 });
    }
    
    const testimonialData = await request.json();
    
    // Validation des données
    if (!testimonialData.name || !testimonialData.role || !testimonialData.content) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Préparation des données à mettre à jour
    const updateData = {
      name: testimonialData.name,
      role: testimonialData.role,
      content: testimonialData.content,
      rating: parseInt(testimonialData.rating || 5, 10),
      imgSrc: testimonialData.imgSrc || '',
      published: testimonialData.published === undefined ? true : testimonialData.published,
      order: parseInt(testimonialData.order || 0, 10),
      updatedAt: new Date()
    };
    
    const result = await db.collection('testimonials').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Témoignage mis à jour avec succès',
      id
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du témoignage' }, { status: 500 });
  }
}

// Supprimer un témoignage par ID
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de témoignage invalide' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection('testimonials').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du témoignage:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du témoignage' }, { status: 500 });
  }
} 