'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async (page = 1, search = '', category = '') => {
    try {
      setIsLoading(true);
      let url = `/api/admin/projects?page=${page}&limit=10`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des projets');
      }
      
      const data = await response.json();
      
      setProjects(data.projects || []);
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
    fetchProjects(currentPage, searchTerm, categoryFilter);
  }, [currentPage, searchTerm, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects(1, searchTerm, categoryFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSelection = (projectId) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(project => project._id));
    }
  };

  const togglePublish = async (projectId, published) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du projet');
      }

      setProjects(projects.map(project => 
        project._id === projectId ? { ...project, published: !published } : project
      ));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const toggleFeatured = async (projectId, featured) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !featured }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du projet');
      }

      setProjects(projects.map(project => 
        project._id === projectId ? { ...project, featured: !featured } : project
      ));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }

      // Rafraîchir la liste des projets
      fetchProjects(currentPage, searchTerm, categoryFilter);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProjects.length} projets ?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Supprimer chaque projet sélectionné
      await Promise.all(
        selectedProjects.map(id => 
          fetch(`/api/admin/projects/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Rafraîchir la liste
      fetchProjects(currentPage, searchTerm, categoryFilter);
      setSelectedProjects([]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Extraire toutes les catégories uniques des projets
  const uniqueCategories = [...new Set(projects.map(project => project.category))];

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 fw-bold mb-0">Gestion des projets</h1>
          <Link href="/admin/projects/new" className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Nouveau projet
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body border-bottom">
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label mb-0 small">Recherche</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un projet..."
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label mb-0 small">Catégorie</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Toutes les catégories</option>
                    {uniqueCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 d-grid">
                  <button type="submit" className="btn btn-outline-primary">
                    <i className="fa-solid fa-search me-1"></i> Rechercher
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fa-solid fa-briefcase fa-2xl mb-3"></i>
            <p className="mb-0">Aucun projet trouvé</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{width:'40px'}}>
                      <input
                        type="checkbox"
                        checked={selectedProjects.length === projects.length && projects.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th scope="col">Image</th>
                    <th scope="col">Titre</th>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Client</th>
                    <th scope="col">Statut</th>
                    <th scope="col">À la une</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project._id)}
                          onChange={() => toggleSelection(project._id)}
                        />
                      </td>
                      <td>
                        {project.imgSrc ? (
                          <img src={project.imgSrc} alt={project.title} className="rounded" style={{width:'80px', height:'50px', objectFit:'cover'}}/>
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{width:'80px', height:'50px'}}>
                            <i className="fa-solid fa-image text-muted" />
                          </div>
                        )}
                      </td>
                      <td className="fw-medium">{project.title}</td>
                      <td>{project.category}</td>
                      <td>{project.client}</td>
                      <td>
                        <button
                          onClick={() => togglePublish(project._id, project.published)}
                          className={`badge ${project.published ? 'bg-success' : 'bg-secondary'}`}
                        >
                          {project.published ? 'Publié' : 'Brouillon'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleFeatured(project._id, project.featured)}
                          className={`badge ${project.featured ? 'bg-info' : 'bg-secondary'}`}
                        >
                          {project.featured ? 'À la une' : 'Normal'}
                        </button>
                      </td>
                      <td className="text-end">
                        <Link href={`/admin/projects/${project._id}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="fa-solid fa-pen" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={isDeleting}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination et actions en bas */}
            <div className="border-top py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                {selectedProjects.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="btn btn-danger"
                  >
                    {isDeleting ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="fa-solid fa-trash me-2" />
                    )}
                    Supprimer ({selectedProjects.length})
                  </button>
                )}
              </div>
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 && 'disabled'}`}> 
                      <button className="page-link" onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i+1} className={`page-item ${currentPage === i+1 && 'active'}`}>
                        <button className="page-link" onClick={() => handlePageChange(i+1)}>{i+1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages && 'disabled'}`}> 
                      <button className="page-link" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
} 