'use client';

import { useState, useRef } from 'react';

export default function ImageUploader({ onImageUploaded, type = 'general', className = '' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Prévisualisation de l'image
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload automatique
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du téléchargement de l\'image');
      }
      
      const data = await response.json();
      
      if (onImageUploaded) {
        onImageUploaded(data.url);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload automatique
      handleUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={className}>
      <div
        className={`position-relative border border-2 border-dashed rounded p-4 text-center 
          ${isUploading ? 'bg-light border-secondary' : 'border-secondary'} 
          ${!isUploading ? 'hover-border-primary' : ''} 
          cursor-pointer d-flex flex-column justify-content-center align-items-center`}
        style={{ 
          height: '160px', 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isUploading ? '#f8f9fa' : 'transparent'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        onMouseEnter={(e) => {
          if (!isUploading) {
            e.target.style.borderColor = '#0d6efd';
            e.target.style.backgroundColor = '#f0f8ff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isUploading) {
            e.target.style.borderColor = '#6c757d';
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="d-none"
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
        
        {preview && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="img-fluid rounded"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 rounded"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0)',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0)';
              }}
            ></div>
          </div>
        )}
        
        {!preview && (
          <>
            <i className="bi bi-cloud-upload display-4 text-muted mb-2"></i>
            <p className="text-muted mb-1">
              Glissez-déposez une image ou cliquez pour sélectionner
            </p>
            <p className="text-muted small">
              PNG, JPG, GIF, WEBP · Max 5MB
            </p>
          </>
        )}
        
        {isUploading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Téléchargement...</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="alert alert-danger mt-2 small">
          {error}
        </div>
      )}
    </div>
  );
} 