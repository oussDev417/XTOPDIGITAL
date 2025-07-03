'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPartners() {
  const { status } = useSession();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ imageUrl: '', name: '', order: 0, published: true });
  const [saving, setSaving] = useState(false);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/partners', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      const data = await res.json();
      setLogos(data.logos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchLogos();
  }, [status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      setForm({ imageUrl: '', name: '', order: 0, published: true });
      await fetchLogos();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (logo) => {
    try {
      await fetch('/api/admin/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: logo._id, published: !logo.published }),
      });
      fetchLogos();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce logo ?')) return;
    try {
      await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      fetchLogos();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="h2 fw-bold mb-4">Logos partenaires</h1>

        {/* Formulaire ajout */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white">
            <h5 className="mb-0">Ajouter un logo</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">URL de l'image</label>
                <input
                  type="text"
                  className="form-control"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Nom (facultatif)</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Ordre</label>
                <input
                  type="number"
                  className="form-control"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Publié</label>
                </div>
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? 'Ajout…' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : logos.length === 0 ? (
          <p className="text-muted">Aucun logo</p>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Ordre</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logos.map((logo) => (
                    <tr key={logo._id}>
                      <td>
                        <img src={logo.imageUrl} alt={logo.name} style={{ width: '80px', height: '50px', objectFit: 'contain' }} />
                      </td>
                      <td>{logo.name || <span className="text-muted">—</span>}</td>
                      <td>{logo.order}</td>
                      <td>
                        <span className={`badge ${logo.published ? 'bg-success' : 'bg-secondary'}`}>
                          {logo.published ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2" onClick={() => togglePublish(logo)}>
                          {logo.published ? 'Dépublier' : 'Publier'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(logo._id)}>
                          Supprimer
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