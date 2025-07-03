'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/admin/blog/BlogForm';

export default function CreateBlog() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (form, setErrorForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du blog');
      }
      router.push('/admin/blogs');
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container" style={{maxWidth:'900px'}}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Nouveau blog</h1>
          <button onClick={()=>router.back()} className="btn btn-outline-secondary">Retour</button>
        </div>
        <BlogForm initialData={{}} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
} 