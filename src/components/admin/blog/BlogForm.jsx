'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BlogForm({ initialData, onSubmit, onDelete, isSubmitting, isEdit=false }) {
  const [form, setForm] = useState({
    title: '', slug: '', author: '', excerpt: '', content: '', categories: [], imgSrc: '', published: false,
    ...initialData
  });
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e)=>{
    const { name, value, type, checked } = e.target;
    setForm(prev=>({...prev,[name]: type==='checkbox'?checked:value}));
  };

  const generateSlug=()=>{
    if(!form.title) return;
    const slug=form.title.toLowerCase().replace(/[^\w\s]/gi,'').replace(/\s+/g,'-');
    setForm(prev=>({...prev,slug}));
  };

  const addCategory=(e)=>{
    e.preventDefault();
    if(!newCategory.trim())return;
    if(!form.categories.includes(newCategory.trim())){
      setForm(prev=>({...prev,categories:[...prev.categories,newCategory.trim()]}));
    }
    setNewCategory('');
  };
  const removeCategory=(cat)=>{
    setForm(prev=>({...prev,categories:prev.categories.filter(c=>c!==cat)}));
  };

  const internalSubmit=async(e)=>{
    e.preventDefault();
    setError(null);
    if(!form.title||!form.slug||!form.author||!form.excerpt||!form.content||!form.imgSrc){
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit && onSubmit(form, setError);
  };

  return (
    <form onSubmit={internalSubmit} className="card border-0 shadow-sm">
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Titre*</label>
            <input className="form-control" name="title" value={form.title} onChange={handleChange} onBlur={generateSlug} required/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Slug*</label>
            <div className="input-group">
              <input className="form-control" name="slug" value={form.slug} onChange={handleChange} required/>
              <button type="button" className="btn btn-outline-secondary" onClick={generateSlug}>Générer</button>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label">Auteur*</label>
            <input className="form-control" name="author" value={form.author} onChange={handleChange} required/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Image URL*</label>
            <input className="form-control" name="imgSrc" value={form.imgSrc} onChange={handleChange} required/>
            {form.imgSrc && <img src={form.imgSrc} alt="thumb" className="img-thumbnail mt-2" style={{width:'120px',height:'80px',objectFit:'cover'}}/>}
          </div>
          <div className="col-12">
            <label className="form-label">Extrait* (max 200 caractères)</label>
            <textarea className="form-control" name="excerpt" maxLength={200} rows={2} value={form.excerpt} onChange={handleChange} required/>
          </div>
          <div className="col-12">
            <label className="form-label">Contenu*</label>
            <ReactQuill value={form.content} onChange={(c)=>setForm(prev=>({...prev,content:c}))} theme="snow" />
          </div>
          <div className="col-12">
            <label className="form-label">Catégories</label>
            <div className="mb-2">
              {form.categories.map((cat,i)=>(<span key={i} className="badge bg-primary me-2 mb-1">{cat} <button type="button" className="btn-close btn-close-white btn-sm ms-1" onClick={()=>removeCategory(cat)}></button></span>))}
            </div>
            <div className="input-group">
              <input className="form-control" value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="Nouvelle catégorie"/>
              <button className="btn btn-outline-secondary" onClick={addCategory}>Ajouter</button>
            </div>
          </div>
          {isEdit && (
            <div className="col-md-3">
              <div className="form-check form-switch mt-4">
                <input className="form-check-input" type="checkbox" name="published" checked={form.published} onChange={handleChange}/>
                <label className="form-check-label">Publié</label>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between">
        {isEdit && onDelete && <button type="button" className="btn btn-outline-danger" onClick={()=>onDelete(form)} disabled={isSubmitting}><i className="fa-solid fa-trash me-1"></i>Supprimer</button>}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting?'Enregistrement…':'Enregistrer'}</button>
      </div>
    </form>
  );
} 