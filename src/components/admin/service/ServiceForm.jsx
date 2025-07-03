'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/admin/ImageUploader';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ServiceForm({ initialData = {}, onSubmit, onDelete, isSubmitting, isEdit = false }) {
  const [form, setForm] = useState({
    title: '', slug: '', category: '', description: '', content: '', icon: 'bi bi-gear', imgSrc: '', gallery: [], published: true, featured: false, order: 0,
    ...initialData,
  });
  const [error, setError] = useState(null);
  const [galleryInput, setGalleryInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const generateSlug = () => {
    if (!form.title) return;
    const slug = form.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleImgUploaded = (url) => setForm((prev) => ({ ...prev, imgSrc: url }));

  const addGalleryUrl = () => {
    if (!galleryInput.trim()) return;
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, galleryInput.trim()] }));
    setGalleryInput('');
  };
  const removeGallery = (url) => setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((u) => u !== url) }));

  const internalSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.slug || !form.description || !form.content || !form.imgSrc) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit && onSubmit(form, setError);
  };

  return (
    <form className="card border-0 shadow-sm" onSubmit={internalSubmit}>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Titre*</label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} onBlur={generateSlug} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Slug*</label>
            <div className="input-group">
              <input className="form-control" name="slug" value={form.slug} onChange={handleChange} required />
              <button type="button" className="btn btn-outline-secondary" onClick={generateSlug}>
                Générer
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Catégorie</label>
            <input className="form-control" name="category" value={form.category || ''} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Icône Bootstrap Icons*</label>
            <div className="input-group">
              <input className="form-control" name="icon" value={form.icon} onChange={handleChange} required />
              <span className="input-group-text"><i className={form.icon}></i></span>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Image principale*</label>
            <ImageUploader type="service" onImageUploaded={handleImgUploaded} />
            {form.imgSrc && <img src={form.imgSrc} alt="thumb" className="img-thumbnail mt-2" style={{ width: '120px', height: '80px', objectFit: 'cover' }} />}
          </div>
          <div className="col-12">
            <label className="form-label">Galerie (URLs)</label>
            <div className="mb-2">
              {form.gallery.map((url, idx) => (
                <span key={idx} className="badge bg-secondary me-2 mb-1">
                  {url}
                  <button type="button" className="btn-close btn-close-white btn-sm ms-1" onClick={() => removeGallery(url)}></button>
                </span>
              ))}
            </div>
            <div className="input-group">
              <input className="form-control" value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Coller une URL d'image et cliquer sur Ajouter" />
              <button type="button" className="btn btn-outline-secondary" onClick={addGalleryUrl}>Ajouter</button>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Description courte*</label>
            <textarea className="form-control" name="description" rows={3} value={form.description} onChange={handleChange} required></textarea>
          </div>
          <div className="col-12">
            <label className="form-label">Contenu détaillé*</label>
            <ReactQuill value={form.content} onChange={(c) => setForm((prev) => ({ ...prev, content: c }))} theme="snow" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Ordre</label>
            <input type="number" className="form-control" name="order" value={form.order} onChange={handleChange} />
          </div>
          {isEdit && (
            <div className="col-md-3">
              <div className="form-check mt-4">
                <input className="form-check-input" type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                <label className="form-check-label">Publié</label>
              </div>
              <div className="form-check mt-2">
                <input className="form-check-input" type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                <label className="form-check-label">Mis en avant</label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between">
        {isEdit && onDelete && (
          <button type="button" className="btn btn-outline-danger" onClick={() => onDelete(form)} disabled={isSubmitting}>
            <i className="fa-solid fa-trash me-1"></i>Supprimer
          </button>
        )}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  );
} 