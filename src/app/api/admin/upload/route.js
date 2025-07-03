import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non pris en charge. Veuillez télécharger une image JPEG, PNG, GIF ou WEBP.' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximale : 2MB.' },
        { status: 400 }
      );
    }
    
    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Solution temporaire : encoder en base64
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()}`;
    
    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: filename,
      note: 'Image encodée en base64. Pour une utilisation en production, configurez Cloudinary.'
    });
    
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier: ' + error.message },
      { status: 500 }
    );
  }
}
