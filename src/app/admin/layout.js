'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Bootstrap from '@/components/Bootstrap';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Si c'est la page de login, ne pas rendre la barre latérale ni le header admin
  if (isLoginPage) {
    return <>{children}</>;
  }

  useEffect(() => {
    // Réduire la barre latérale automatiquement sur les écrans mobiles
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initialiser
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirection si non authentifié (hors page login)
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      redirect('/admin/login');
    }
  }, [status, isLoginPage]);

  // Afficher un loader pendant la vérification de l'authentification
  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { title: 'Tableau de bord', path: '/admin', icon: 'fa-solid fa-gauge-high' },
    { title: 'Blogs', path: '/admin/blogs', icon: 'fa-solid fa-file-lines' },
    { title: 'Commentaires', path: '/admin/comments', icon: 'fa-solid fa-comments' },
    { title: 'Messages', path: '/admin/messages', icon: 'fa-solid fa-envelope' },
    { title: 'Services', path: '/admin/services', icon: 'fa-solid fa-gear' },
    { title: 'Projets', path: '/admin/projects', icon: 'fa-solid fa-briefcase' },
    { title: 'Témoignages', path: '/admin/testimonials', icon: 'fa-solid fa-comment-dots' },
    { title: 'Pricing', path: '/admin/pricing', icon: 'fa-solid fa-tags' },
    { title: 'Utilisateurs', path: '/admin/users', icon: 'fa-solid fa-users' },
    { title: 'Partenaires', path: '/admin/partners', icon: 'fa-solid fa-handshake' },
    { title: 'Paramètres', path: '/admin/settings', icon: 'fa-solid fa-sliders' },
  ];

  return (
    <>
      <Bootstrap />
      <div className="d-flex min-vh-100 bg-light">
        {/* Sidebar */}
        <div 
          className={`sidebar bg-white shadow ${isSidebarOpen ? 'expanded' : 'collapsed'}`} 
          style={{
            width: isSidebarOpen ? '280px' : '70px',
            position: 'fixed',
            height: '100vh',
            zIndex: 1000,
            transition: 'width 0.3s ease'
          }}
        >
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <Link href="/admin" className={`text-decoration-none fw-bold fs-5 ${!isSidebarOpen && 'd-none'}`}>
              Admin XTOP
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn btn-sm btn-outline-secondary border-0"
            >
              <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>
          </div>

          <div className="overflow-auto" style={{ height: 'calc(100vh - 130px)' }}>
            <nav className="p-3">
              <ul className="list-unstyled mb-0">
                {menuItems.map((item) => (
                  <li key={item.path} className="mb-2">
                    <Link
                      href={item.path}
                      className={`d-flex align-items-center text-decoration-none p-2 rounded ${
                        pathname === item.path 
                          ? 'bg-primary bg-opacity-10 text-primary' 
                          : 'text-dark hover-bg-light'
                      }`}
                    >
                      <i className={`${item.icon} ${isSidebarOpen ? 'me-3' : 'mx-auto'}`}></i>
                      {isSidebarOpen && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-top p-3">
            <div className={`d-flex align-items-center ${!isSidebarOpen && 'justify-content-center'}`}>
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              {isSidebarOpen && (
                <div>
                  <p className="mb-0 fw-medium small">{session?.user?.name || 'Admin'}</p>
                  <p className="mb-0 small text-muted">{session?.user?.email || ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div 
          className="main-content bg-light" 
          style={{
            marginLeft: isSidebarOpen ? '280px' : '70px',
            width: `calc(100% - ${isSidebarOpen ? '280px' : '70px'})`,
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }}
        >
          <header className="bg-white shadow-sm py-3 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0 fw-bold text-dark">
                Administration
              </h1>
              <div className="d-flex gap-3">
                <Link href="/" target="_blank" className="text-decoration-none text-secondary">
                  <i className="fa-solid fa-house me-1"></i>
                  <span className="d-none d-sm-inline">Voir le site</span>
                </Link>
                <Link href="/api/auth/signout" className="text-decoration-none text-danger">
                  <i className="fa-solid fa-right-from-bracket me-1"></i>
                  <span className="d-none d-sm-inline">Déconnexion</span>
                </Link>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}