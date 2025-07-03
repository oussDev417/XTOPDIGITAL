import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

// GET un service spécifique
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const service = await Service.findById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - mettre à jour un service
export async function PUT(req, { params }) {
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
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Titre et description sont requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si le slug existe déjà pour un autre service
    if (body.slug) {
      const existingService = await Service.findOne({
        slug: body.slug,
        _id: { $ne: params.id }
      });
      
      if (existingService) {
        return NextResponse.json(
          { error: 'Un service avec ce slug existe déjà' },
          { status: 400 }
        );
      }
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - supprimer un service
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const deletedService = await Service.findByIdAndDelete(params.id);
    
    if (!deletedService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }
    
    // Réorganiser les services restants pour maintenir un ordre cohérent
    await Service.updateMany(
      { order: { $gt: deletedService.order } },
      { $inc: { order: -1 } }
    );
    
    return NextResponse.json(
      { message: 'Service supprimé avec succès' }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 