'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ServiceForm from '@/components/admin/service/ServiceForm';

export default function AddService() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (form, setErr) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }
      router.push('/admin/services');
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Ajouter un service</h1>
          <button onClick={() => router.back()} className="btn btn-outline-secondary">Retour</button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <ServiceForm initialData={{}} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
} 