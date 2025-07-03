'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async (page = 1, search = '') => {
    try {
      setIsLoading(true);
      let url = `/api/admin/blogs?page=${page}&limit=10`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des blogs');
      }
      
      const data = await response.json();
      
      setBlogs(data.blogs || []);
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
    fetchBlogs(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSelection = (blogId) => {
    setSelectedBlogs(prev => {
      if (prev.includes(blogId)) {
        return prev.filter(id => id !== blogId);
      } else {
        return [...prev, blogId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog._id));
    }
  };

  const togglePublish = async (blogId, published) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du blog');
      }

      setBlogs(blogs.map(blog => 
        blog._id === blogId ? { ...blog, published: !published } : blog
      ));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du blog');
      }

      // Rafraîchir la liste des blogs
      fetchBlogs(currentPage, searchTerm);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedBlogs.length} blogs ?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      
      // Supprimer chaque blog sélectionné
      await Promise.all(
        selectedBlogs.map(id => 
          fetch(`/api/admin/blogs/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Rafraîchir la liste
      fetchBlogs(currentPage, searchTerm);
      setSelectedBlogs([]);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 fw-bold mb-0">Gestion des blogs</h1>
          <Link href="/admin/blogs/new" className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Nouveau blog
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body border-bottom">
            <form onSubmit={handleSearch} className="row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un blog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="fa-solid fa-search me-1"></i>Rechercher
                </button>
              </div>
            </form>
          </div>

          {/* sélection */}
          {selectedBlogs.length > 0 && (
            <div className="card-body border-bottom d-flex justify-content-between align-items-center bg-light">
              <span>{selectedBlogs.length} sélectionné(s)</span>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="btn btn-sm btn-outline-danger"
              >
                <i className="fa-solid fa-trash me-1"></i>Supprimer
              </button>
            </div>
          )}

          {/* Tableau */}
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">Aucun blog trouvé</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">
                      <input type="checkbox" checked={selectedBlogs.length===blogs.length&&blogs.length>0} onChange={toggleSelectAll}/>
                    </th>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <input type="checkbox" checked={selectedBlogs.includes(blog._id)} onChange={()=>toggleSelection(blog._id)}/>
                      </td>
                      <td style={{maxWidth:'300px'}}>
                        <div className="d-flex align-items-center gap-3">
                          <img src={blog.thumbnail || blog.coverImage || '/images/blogs/placeholder.png'} alt={blog.title} style={{width:'80px',height:'50px',objectFit:'cover'}} className="rounded"/>
                          <span className="fw-medium text-truncate" style={{maxWidth:'200px'}}>{blog.title}</span>
                        </div>
                      </td>
                      <td>{blog.author || '—'}</td>
                      <td>
                        <span className={`badge ${blog.published?'bg-success':'bg-secondary'}`}>{blog.published?'Publié':'Brouillon'}</span>
                      </td>
                      <td>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="text-end">
                        <Link href={`/admin/blogs/${blog._id}`} className="btn btn-sm btn-outline-primary me-2">
                          Éditer
                        </Link>
                        <button className="btn btn-sm btn-outline-warning me-2" onClick={()=>togglePublish(blog._id,blog.published)}>
                          {blog.published?'Dépublier':'Publier'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(blog._id)} disabled={isDeleting}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages>1 && (
          <nav className="mt-3 d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({length: totalPages}, (_,i)=>(
                <li key={i} className={`page-item ${currentPage===i+1?'active':''}`}> 
                  <button className="page-link" onClick={()=>handlePageChange(i+1)}>{i+1}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
} 