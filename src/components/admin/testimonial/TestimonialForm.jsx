import { useState } from 'react';

export default function TestimonialForm({ initialData = {}, onSubmit, onDelete, isSubmitting, isEdit = false }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    imgSrc: '',
    published: true,
    order: 0,
    ...initialData,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRatingChange = (val) => setForm((prev) => ({ ...prev, rating: val }));

  const internalSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.role || !form.content) {
      setError('Veuillez remplir les champs obligatoires');
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
            <label className="form-label">Nom*</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fonction / Entreprise*</label>
            <input className="form-control" name="role" value={form.role} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL de l'image</label>
            <input className="form-control" name="imgSrc" value={form.imgSrc} onChange={handleChange} placeholder="/images/testimonials/avatar.png" />
            {form.imgSrc && (
              <img src={form.imgSrc} alt="avatar" className="rounded-circle mt-2" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label">Note</label>
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                <i
                  key={n}
                  role="button"
                  className={`fa-star fs-4 me-1 ${form.rating >= n ? 'fa-solid text-warning' : 'fa-regular text-muted'}`}
                  onClick={() => handleRatingChange(n)}
                />
              ))}
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Ordre</label>
            <input type="number" className="form-control" name="order" value={form.order} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label className="form-label">Contenu*</label>
            <textarea className="form-control" name="content" rows={5} value={form.content} onChange={handleChange} required></textarea>
          </div>
          <div className="col-md-3">
            <div className="form-check form-switch mt-2">
              <input className="form-check-input" type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              <label className="form-check-label">Publié</label>
            </div>
          </div>
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