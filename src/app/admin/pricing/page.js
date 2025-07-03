'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPricing() {
  const { status } = useSession();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ title: '', price: '', period: 'Per year', features: '', order: 0, published: true });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pricing', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchPlans();
  }, [status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, features: form.features.split('\n').filter((f) => f.trim() !== '') };
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      setForm({ title: '', price: '', period: 'Per year', features: '', order: 0, published: true });
      fetchPlans();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (plan) => {
    try {
      await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: plan._id, published: !plan.published }),
      });
      fetchPlans();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce plan ?')) return;
    try {
      await fetch(`/api/admin/pricing?id=${id}`, { method: 'DELETE' });
      fetchPlans();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="h2 fw-bold mb-4">Plans de tarification</h1>

        {/* Formulaire ajout */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white">
            <h5 className="mb-0">Ajouter un plan</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Titre</label>
                <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Prix</label>
                <input type="text" className="form-control" name="price" value={form.price} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Période</label>
                <input type="text" className="form-control" name="period" value={form.period} onChange={handleChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Ordre</label>
                <input type="number" className="form-control" name="order" value={form.order} onChange={handleChange} />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                  <label className="form-check-label">Publié</label>
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Fonctionnalités (une par ligne)</label>
                <textarea className="form-control" rows="4" name="features" value={form.features} onChange={handleChange}></textarea>
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-primary" disabled={saving}>{saving ? 'Ajout…' : 'Ajouter'}</button>
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
        ) : plans.length === 0 ? (
          <p className="text-muted">Aucun plan</p>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Titre</th>
                    <th>Prix</th>
                    <th>Période</th>
                    <th>Ordre</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id}>
                      <td>{plan.title}</td>
                      <td>{plan.price}</td>
                      <td>{plan.period}</td>
                      <td>{plan.order}</td>
                      <td>
                        <span className={`badge ${plan.published ? 'bg-success' : 'bg-secondary'}`}>{plan.published ? 'Publié' : 'Brouillon'}</span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2" onClick={() => togglePublish(plan)}>{plan.published ? 'Dépublier' : 'Publier'}</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plan._id)}>Supprimer</button>
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