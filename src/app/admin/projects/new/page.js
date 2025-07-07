'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProject() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    content: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    imgSrc: '',
    gallery: [],
    technologies: '',
    published: true,
    featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      
      setFormData({
        ...formData,
        slug
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Préparer les données
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      // Envoyer la requête
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création du projet');
      }

      // Redirection vers la liste des projets
      router.push('/admin/projects');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imgSrc: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouveau projet</h1>
        <Link href="/admin/projects">
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
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 p-2 border rounded-l"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="bg-gray-100 px-3 py-2 border border-l-0 rounded-r"
                  >
                    Générer
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="client" className="block text-gray-700 mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="imgSrc" className="block text-gray-700 mb-2">
                  URL de l'image principale <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="imgSrc"
                  name="imgSrc"
                  value={formData.imgSrc}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Exemple: /images/projects/project-1.png
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="technologies" className="block text-gray-700 mb-2">
                  Technologies
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="HTML, CSS, JavaScript"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Séparez les technologies par des virgules
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="imgUpload" className="block text-gray-700 mb-2">
                  Upload d'image
                </label>
                <input
                  type="file"
                  id="imgUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 mb-2">
                  Contenu détaillé <span className="text-red-500">*</span>
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

              <div className="flex flex-col space-y-2">
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
                    Publié
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="featured" className="text-gray-700">
                    Mettre à la une
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6 flex justify-end space-x-4">
            <Link href="/admin/projects">
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