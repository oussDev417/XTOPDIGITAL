'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/contact/messages', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors du chargement des messages');
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages();
    }
  }, [status]);

  const toggleRead = async (id, read) => {
    try {
      const res = await fetch(`/api/admin/contact/messages?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !read }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de mise à jour');
      }
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      const res = await fetch(`/api/admin/contact/messages?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de suppression');
      }
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading') {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </section>
    );
  }
  if (status === 'unauthenticated') {
    return (
      <section className="py-5">
        <div className="container">
          <div className="alert alert-danger">
            Veuillez vous connecter. <Link href="/admin/login">Connexion</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 mb-0 fw-bold">Messages de contact</h1>
        </div>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted">Aucun message</p>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>Message</th>
                    <th className="text-nowrap">Date</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg._id} className={msg.read ? '' : 'table-warning'}>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.subject || <span className="text-muted">—</span>}</td>
                      <td style={{ maxWidth: '250px' }} className="text-truncate">
                        {msg.message}
                      </td>
                      <td className="text-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td>
                        {msg.read ? (
                          <span className="badge bg-secondary">Lu</span>
                        ) : (
                          <span className="badge bg-primary">Nouveau</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => toggleRead(msg._id, msg.read)}
                        >
                          {msg.read ? (
                            <>Marquer non lu</>
                          ) : (
                            <>Marquer lu</>
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(msg._id)}
                        >
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