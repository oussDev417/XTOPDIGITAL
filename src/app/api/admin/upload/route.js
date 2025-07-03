import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
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
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Créer un nom de fichier unique avec timestamp
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Déterminer le dossier de destination en fonction du type de contenu
    const contentType = formData.get('type') || 'general';
    let uploadDir;
    
    switch (contentType) {
      case 'blog':
        uploadDir = 'blogs';
        break;
      case 'service':
        uploadDir = 'services';
        break;
      case 'project':
        uploadDir = 'projects';
        break;
      case 'testimonial':
        uploadDir = 'testimonials';
        break;
      default:
        uploadDir = 'general';
    }
    
    // Construire le chemin complet
    const uploadPath = path.join(process.cwd(), 'public', 'images', uploadDir);
    const filePath = path.join(uploadPath, filename);
    const publicPath = `/images/${uploadDir}/${filename}`;
    
    // Écrire le fichier
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      success: true,
      url: publicPath
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
} 