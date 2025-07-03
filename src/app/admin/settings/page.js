'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const [detail, setDetail] = useState({ address: '', phone: '', email: '', mapEmbedUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/contact');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      const data = await res.json();
      setDetail(data.detail || { address: '', phone: '', email: '', mapEmbedUrl: '' });
    } catch (err) {
      setAlert({ type: 'danger', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') fetchDetail();
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detail),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      const data = await res.json();
      setDetail(data.detail);
      setAlert({ type: 'success', msg: 'Coordonnées mises à jour' });
    } catch (err) {
      setAlert({ type: 'danger', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <section className="py-5">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      </section>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <section className="py-5">
        <div className="container">
          <div className="alert alert-danger">
            Vous devez être connecté. <Link href="/admin/login">Connexion</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="h2 fw-bold mb-4">Coordonnées du site</h1>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.msg}
          </div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={detail.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Téléphone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={detail.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={detail.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">URL Google Map Embed (optionnel)</label>
              <input
                type="text"
                className="form-control"
                name="mapEmbedUrl"
                value={detail.mapEmbedUrl}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
} 