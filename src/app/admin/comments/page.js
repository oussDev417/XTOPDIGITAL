'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminComments() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'all'

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      let url = `/api/admin/comments`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du chargement des commentaires');
      }
      
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur de chargement des commentaires:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchComments();
    }
  }, [filter, status]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour du commentaire');
      }

      fetchComments();
    } catch (err) {
      setError(err.message);
      console.error('Erreur d\'approbation:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression du commentaire');
      }

      fetchComments();
    } catch (err) {
      setError(err.message);
      console.error('Erreur de suppression:', err);
    }
  };

  if (status === 'loading') {
    return (
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
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
          <div className="alert alert-danger">
            Vous devez être connecté pour accéder à cette page. <Link href="/admin/login" className="alert-link">Se connecter</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 fw-bold">Gestion des commentaires</h1>
          <div className="btn-group">
            <button 
              onClick={() => setFilter('pending')}
              className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
            >
              En attente
            </button>
            <button 
              onClick={() => setFilter('approved')}
              className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
            >
              Approuvés
            </button>
            <button 
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            >
              Tous
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-muted">
            {filter === 'pending' 
              ? "Aucun commentaire en attente d'approbation"
              : filter === 'approved'
                ? "Aucun commentaire approuvé"
                : "Aucun commentaire"
            }
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Auteur</th>
                    <th scope="col">Article</th>
                    <th scope="col">Commentaire</th>
                    <th scope="col">Date</th>
                    <th scope="col">Statut</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment._id}>
                      <td>
                        <div>
                          <div className="fw-medium">{comment.name}</div>
                          <div className="small text-muted">{comment.email}</div>
                        </div>
                      </td>
                      <td>
                        {comment.blog ? (
                          <Link href={`/blog/${comment.blog.slug}`} className="text-decoration-none">
                            {comment.blog.title}
                          </Link>
                        ) : (
                          <span className="text-muted">Article supprimé</span>
                        )}
                      </td>
                      <td>
                        <div className="text-truncate" style={{maxWidth: '250px'}}>
                          {comment.message}
                        </div>
                      </td>
                      <td className="text-nowrap text-muted">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        <span className={`badge ${
                          comment.approved 
                            ? 'bg-success' 
                            : 'bg-warning'
                        }`}>
                          {comment.approved ? 'Approuvé' : 'En attente'}
                        </span>
                      </td>
                      <td className="text-end">
                        {!comment.approved && (
                          <button
                            onClick={() => handleApprove(comment._id)}
                            className="btn btn-sm btn-success me-2"
                          >
                            <i className="fa-solid fa-check me-1"></i> Approuver
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(comment._id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fa-solid fa-trash me-1"></i> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}