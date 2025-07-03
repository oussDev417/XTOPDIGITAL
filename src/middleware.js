import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Vérifier si le chemin est protégé (commence par /admin ou /api/admin)
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isAdminApiPath = path.startsWith('/api/admin');
  
  if (isAdminPath || isAdminApiPath) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!session) {
      const url = new URL('/admin/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(path));
      return NextResponse.redirect(url);
    }

    // Vérifier le rôle d'administrateur pour les chemins /api/admin
    if (isAdminApiPath && session.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Accès non autorisé' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

// Configurer les chemins pour lesquels ce middleware s'exécute
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}; 