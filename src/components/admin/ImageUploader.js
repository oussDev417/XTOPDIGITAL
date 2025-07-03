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
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center 
          ${isUploading ? 'bg-gray-100 border-gray-400' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'} 
          transition-colors cursor-pointer h-40 flex flex-col justify-center items-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
        
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-full max-w-full object-contain rounded" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded"></div>
          </div>
        )}
        
        {!preview && (
          <>
            <i className="bi bi-cloud-upload text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500">
              Glissez-déposez une image ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF, WEBP · Max 5MB
            </p>
          </>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 