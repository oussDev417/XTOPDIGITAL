'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditTestimonial({ params }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    imgSrc: '',
    published: true,
    order: 0
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/testimonials/${id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du témoignage');
        }
        
        const testimonial = await response.json();
        setFormData(testimonial);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonial();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour du témoignage');
      }

      // Redirection vers la liste des témoignages
      router.push('/admin/testimonials');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du témoignage');
      }

      // Redirection vers la liste des témoignages
      router.push('/admin/testimonials');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifier le témoignage</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleDelete}
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
          >
            <i className="bi bi-trash mr-2"></i>Supprimer
          </button>
          <Link href="/admin/testimonials">
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200">
              <i className="bi bi-arrow-left mr-2"></i>Retour
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 mb-2">
                  Fonction / Entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="imgSrc" className="block text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="text"
                  id="imgSrc"
                  name="imgSrc"
                  value={formData.imgSrc}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="/images/testimonials/avatar.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Exemple: /images/testimonials/avatar.png
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Note
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl focus:outline-none"
                    >
                      <i className={`bi bi-star${star <= formData.rating ? '-fill' : ''} text-yellow-400`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="order" className="block text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Un ordre plus petit s'affiche en premier
                </p>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-gray-700">
                  Publié
                </label>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 mb-2">
                  Contenu du témoignage <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="10"
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6 flex justify-end space-x-4">
            <Link href="/admin/testimonials">
              <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50">
                Annuler
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <i className="bi bi-hourglass-split mr-2 animate-spin"></i> Enregistrement...
                </span>
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 