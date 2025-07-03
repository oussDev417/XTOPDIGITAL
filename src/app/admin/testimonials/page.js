'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminTestimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      let url = `/api/admin/testimonials?page=${page}&limit=10`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des témoignages');
      }
      
      const data = await response.json();
      
      setTestimonials(data.testimonials || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTestimonials(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSelection = (testimonialId) => {
    setSelectedTestimonials(prev => {
      if (prev.includes(testimonialId)) {
        return prev.filter(id => id !== testimonialId);
      } else {
        return [...prev, testimonialId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedTestimonials.length === testimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(testimonials.map(testimonial => testimonial._id));
    }
  };

  const togglePublish = async (testimonialId, published) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du témoignage');
      }

      setTestimonials(testimonials.map(testimonial => 
        testimonial._id === testimonialId ? { ...testimonial, published: !published } : testimonial
      ));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du témoignage');
      }

      // Rafraîchir la liste des témoignages
      fetchTestimonials(currentPage, searchTerm);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTestimonials.length === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedTestimonials.length} témoignages ?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Supprimer chaque témoignage sélectionné
      await Promise.all(
        selectedTestimonials.map(id => 
          fetch(`/api/admin/testimonials/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Rafraîchir la liste
      fetchTestimonials(currentPage, searchTerm);
      setSelectedTestimonials([]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour réorganiser les témoignages
  const updateOrder = async (testimonialId, newOrder) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'ordre');
      }

      // Rafraîchir la liste
      fetchTestimonials(currentPage, searchTerm);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <section className="py-4">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Gestion des témoignages</h1>
          <Link href="/admin/testimonials/add" className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Nouveau témoignage
          </Link>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body border-bottom">
            <form onSubmit={handleSearch} className="row g-2">
              <div className="col-md-4"><input className="form-control" placeholder="Rechercher un témoignage..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/></div>
              <div className="col-auto"><button className="btn btn-outline-primary" type="submit"><i className="fa-solid fa-search me-1"></i>Rechercher</button></div>
            </form>
          </div>
          {isLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"/></div>
          ) : testimonials.length===0 ? (
            <div className="text-center text-muted py-5">Aucun témoignage trouvé</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th><input type="checkbox" checked={selectedTestimonials.length===testimonials.length&&testimonials.length>0} onChange={toggleSelectAll}/></th>
                    <th>Ordre</th>
                    <th>Photo</th>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Contenu</th>
                    <th>Note</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map(t=>(
                    <tr key={t._id}>
                      <td><input type="checkbox" checked={selectedTestimonials.includes(t._id)} onChange={()=>toggleSelection(t._id)}/></td>
                      <td>{t.order}</td>
                      <td>{t.imgSrc && <img src={t.imgSrc} alt={t.name} className="rounded-circle" style={{width:'60px',height:'60px',objectFit:'cover'}}/>}</td>
                      <td>{t.name}</td>
                      <td>{t.role}</td>
                      <td style={{maxWidth:'250px'}} className="text-truncate">{t.content}</td>
                      <td>{Array.from({length:t.rating}).map((_,i)=><i key={i} className="fa-solid fa-star text-warning"></i>)}</td>
                      <td><span className={`badge ${t.published?'bg-success':'bg-secondary'}`}>{t.published?'Publié':'Brouillon'}</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={()=>togglePublish(t._id,t.published)}>{t.published?'Dépublier':'Publier'}</button>
                        <Link href={`/admin/testimonials/${t._id}`} className="btn btn-sm btn-outline-primary me-2">Modifier</Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(t._id)} disabled={isDeleting}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {totalPages>1 && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({length: totalPages},(_,i)=>(<li key={i} className={`page-item ${currentPage===i+1?'active':''}`}><button className="page-link" onClick={()=>handlePageChange(i+1)}>{i+1}</button></li>))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
} 