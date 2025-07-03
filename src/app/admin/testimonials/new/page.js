'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTestimonial() {
  const router = useRouter();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: parseInt(rating)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Envoyer la requête
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du témoignage');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouveau témoignage</h1>
        <Link href="/admin/testimonials">
          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200">
            <i className="bi bi-arrow-left mr-2"></i>Retour
          </button>
        </Link>
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
                  Rôle / Entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Ex: PDG, Example Inc."
                />
              </div>

              <div className="mb-4">
                <label htmlFor="imgSrc" className="block text-gray-700 mb-2">
                  URL de la photo
                </label>
                <input
                  type="text"
                  id="imgSrc"
                  name="imgSrc"
                  value={formData.imgSrc}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="/images/testimonials/user-1.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Laissez vide pour utiliser un avatar par défaut
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Note / Évaluation
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-2xl focus:outline-none"
                      onClick={() => handleRatingChange(star)}
                    >
                      <i className={`bi ${formData.rating >= star ? 'bi-star-fill text-yellow-400' : 'bi-star text-gray-300'}`}></i>
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
                  0 = automatique (à la fin), 1 = premier, etc.
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="published" className="text-gray-700">
                    Publier immédiatement
                  </label>
                </div>
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
                  placeholder="Écrivez le témoignage ici..."
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum 500 caractères
                </p>
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