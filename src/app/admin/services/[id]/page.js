'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import ServiceForm from '@/components/admin/service/ServiceForm';

export default function EditService({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Service non trouvé');
        }
        
        const service = await response.json();
        setInitialData(service);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchService();
  }, [id]);

  const handleSubmit = async (form, setErr) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }
      router.push('/admin/services');
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du service');
      }
      router.push('/admin/services');
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !initialData) {
    return (
      <section className="py-5 text-center">
        <div className="container">
          <div className="spinner-border text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Modifier le service</h1>
          <button onClick={() => router.back()} className="btn btn-outline-secondary">Retour</button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
          isEdit
        />
      </div>
    </section>
  );
} 