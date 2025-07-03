'use client'
import { useEffect, useState } from 'react';
import SlideUp from '@/utils/animations/slideUp';

export default function ContactInfo() {
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch('/api/contact', { cache: 'no-store' });
        const data = await res.json();
        setDetail(data.detail);
      } catch (e) {
        console.error(e);
      }
    }
    fetchDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setAlert({ type: 'success', msg: 'Message envoyé avec succès !' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setAlert({ type: 'danger', msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-between gx-4 gy-5 align-items-start">
          {/* Coordonnées */}
          <SlideUp className="col-lg-4">
            <h2 className="h3 mb-4">Contactez-nous</h2>
            {detail ? (
              <ul className="list-unstyled">
                <li className="mb-3 d-flex">
                  <i className="fa-solid fa-location-dot fs-4 text-primary me-3"></i>
                  <div>
                    <strong>Adresse</strong>
                    <p className="mb-0">{detail.address}</p>
                  </div>
                </li>
                <li className="mb-3 d-flex">
                  <i className="fa-solid fa-phone fs-4 text-primary me-3"></i>
                  <div>
                    <strong>Téléphone</strong>
                    <p className="mb-0">{detail.phone}</p>
                  </div>
                </li>
                <li className="mb-3 d-flex">
                  <i className="fa-solid fa-envelope fs-4 text-primary me-3"></i>
                  <div>
                    <strong>Email</strong>
                    <p className="mb-0">{detail.email}</p>
                  </div>
                </li>
              </ul>
            ) : (
              <p>Chargement…</p>
            )}
          </SlideUp>

          {/* Formulaire */}
          <SlideUp className="col-lg-7">
            <h2 className="h4 mb-4">Envoyez-nous un message</h2>
            {alert && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.msg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Votre nom"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Votre email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sujet (optionnel)"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Votre message"
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-primary px-4" disabled={loading}>
                  {loading ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </form>
          </SlideUp>
        </div>
      </div>
    </section>
  );
}