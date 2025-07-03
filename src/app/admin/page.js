'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    blogs: 0,
    services: 0,
    projects: 0,
    testimonials: 0,
    comments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (status !== 'authenticated') {
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null); // Réinitialiser l'erreur à chaque nouvelle tentative
        
        // Récupérer les données de façon individuelle pour éviter que l'échec d'une requête n'empêche les autres
        try {
          const blogsRes = await fetch('/api/admin/blogs', { cache: 'no-store' });
          if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            setStats(prev => ({ ...prev, blogs: blogsData?.blogs?.length || 0 }));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des blogs:', e);
        }
        
        try {
          const servicesRes = await fetch('/api/admin/services', { cache: 'no-store' });
          if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            setStats(prev => ({ ...prev, services: servicesData?.services?.length || 0 }));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des services:', e);
        }
        
        try {
          const projectsRes = await fetch('/api/admin/projects', { cache: 'no-store' });
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setStats(prev => ({ ...prev, projects: projectsData?.projects?.length || 0 }));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des projets:', e);
        }
        
        try {
          const testimonialsRes = await fetch('/api/admin/testimonials', { cache: 'no-store' });
          if (testimonialsRes.ok) {
            const testimonialsData = await testimonialsRes.json();
            setStats(prev => ({ ...prev, testimonials: testimonialsData?.testimonials?.length || 0 }));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des témoignages:', e);
        }
        
        try {
          const commentsRes = await fetch('/api/admin/comments', { cache: 'no-store' });
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            setStats(prev => ({ ...prev, comments: commentsData?.comments?.length || 0 }));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des commentaires:', e);
        }
        
      } catch (err) {
        console.error('Erreur globale de récupération des statistiques:', err);
        setError('Impossible de charger certaines statistiques.');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  // Cartes statistiques avec classes personnalisées correspondant au style du site
  const statsCards = [
    { title: 'Articles de Blog', count: stats.blogs, icon: 'fa-solid fa-file-lines', bgClass: 'bg-primary', link: '/admin/blogs' },
    { title: 'Services', count: stats.services, icon: 'fa-solid fa-gear', bgClass: 'bg-success', link: '/admin/services' },
    { title: 'Projets', count: stats.projects, icon: 'fa-solid fa-briefcase', bgClass: 'bg-info', link: '/admin/projects' },
    { title: 'Témoignages', count: stats.testimonials, icon: 'fa-solid fa-comment-dots', bgClass: 'bg-warning', link: '/admin/testimonials' },
    { title: 'Commentaires', count: stats.comments, icon: 'fa-solid fa-comments', bgClass: 'bg-danger', link: '/admin/comments' }
  ];

  if (status === 'loading' || isLoading) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger">
                Vous devez être connecté pour accéder à cette page. <Link href="/admin/login" className="alert-link">Se connecter</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold">Tableau de bord</h1>
            <p className="lead text-muted">Bienvenue dans l'administration de votre site XTOP Digital</p>
            {error && (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Attention :</strong> {error}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="row g-4 mb-5">
          {statsCards.map((card) => (
            <div className="col-md-6 col-lg-3" key={card.title}>
              <Link href={card.link} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex">
                    <div className={`${card.bgClass} text-white rounded-circle p-3 me-3 d-flex align-items-center justify-content-center`} style={{width: '60px', height: '60px'}}>
                      <i className={`${card.icon} fs-4`}></i>
                    </div>
                    <div>
                      <h5 className="card-title">{card.title}</h5>
                      <p className="card-text fs-4 fw-bold text-black mb-0">{card.count}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Actions rapides */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h5 className="card-title mb-0 py-2">Actions rapides</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <Link href="/admin/blogs/new" className="text-decoration-none">
                      <div className="p-3 border rounded d-flex align-items-center transition-all hover-shadow">
                        <i className="fa-solid fa-plus text-primary me-2"></i>
                        <span className="text-black">Nouvel article</span>
                      </div>
                    </Link>
                  </div>
                  <div className="col-sm-6">
                    <Link href="/admin/services/new" className="text-decoration-none">
                      <div className="p-3 border rounded d-flex align-items-center transition-all hover-shadow">
                        <i className="fa-solid fa-plus text-success me-2"></i>
                        <span className="text-black">Nouveau service</span>
                      </div>
                    </Link>
                  </div>
                  <div className="col-sm-6">
                    <Link href="/admin/projects/new" className="text-decoration-none">
                      <div className="p-3 border rounded d-flex align-items-center transition-all hover-shadow">
                        <i className="fa-solid fa-plus text-info me-2"></i>
                        <span className="text-black">Nouveau projet</span>
                      </div>
                    </Link>
                  </div>
                  <div className="col-sm-6">
                    <Link href="/admin/testimonials/new" className="text-decoration-none">
                      <div className="p-3 border rounded d-flex align-items-center transition-all hover-shadow">
                        <i className="fa-solid fa-plus text-warning me-2"></i>
                        <span className="text-black">Nouveau témoignage</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h5 className="card-title mb-0 py-2">Liens utiles</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-0 px-0 py-2">
                    <Link href="/" className="text-decoration-none text-primary d-flex align-items-center" target="_blank">
                      <i className="fa-solid fa-arrow-up-right-from-square me-2"></i>
                      Voir le site
                    </Link>
                  </li>
                  <li className="list-group-item border-0 px-0 py-2">
                    <Link href="/admin/settings" className="text-decoration-none text-primary d-flex align-items-center">
                      <i className="fa-solid fa-gear me-2"></i>
                      Paramètres du site
                    </Link>
                  </li>
                  <li className="list-group-item border-0 px-0 py-2">
                    <Link href="/admin/users" className="text-decoration-none text-primary d-flex align-items-center">
                      <i className="fa-solid fa-users me-2"></i>
                      Gérer les utilisateurs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 