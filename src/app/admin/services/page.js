'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Composant pour un élément déplaçable
const DraggableServiceItem = ({ service, index, moveService, togglePublish, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'service',
    item: { id: service._id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'service',
    hover: (item, monitor) => {
      if (item.index !== index) {
        moveService(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <tr 
      ref={(node) => drag(drop(node))} 
      className={`hover:bg-gray-50 ${isDragging ? 'opacity-50 bg-gray-100' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <i className="bi bi-grip-vertical text-gray-400 mr-2 cursor-move"></i>
          <span className="text-sm text-gray-500">{service.order + 1}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {service.imgSrc && (
            <img 
              src={service.imgSrc} 
              alt={service.title} 
              className="h-10 w-10 object-cover rounded mr-3"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{service.title}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <i className={`${service.icon} text-xl`}></i>
          <span className="ml-2 text-gray-500 text-xs">{service.icon}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span 
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            service.published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {service.published ? 'Publié' : 'Brouillon'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => togglePublish(service._id, service.published)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          {service.published ? 'Dépublier' : 'Publier'}
        </button>
        <button
          onClick={() => onEdit(service._id)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(service._id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
};

export default function AdminServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/services?limit=100');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des services');
      }
      
      const data = await response.json();
      
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const moveService = (fromIndex, toIndex) => {
    const updatedServices = [...services];
    const [movedItem] = updatedServices.splice(fromIndex, 1);
    updatedServices.splice(toIndex, 0, movedItem);
    
    // Mettre à jour l'ordre
    const reorderedServices = updatedServices.map((service, index) => ({
      ...service,
      order: index
    }));
    
    setServices(reorderedServices);
    setHasChanged(true);
  };

  const togglePublish = async (serviceId, published) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du service');
      }

      setServices(services.map(service => 
        service._id === serviceId ? { ...service, published: !published } : service
      ));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleEdit = (serviceId) => {
    router.push(`/admin/services/${serviceId}`);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du service');
      }

      // Rafraîchir la liste des services
      fetchServices();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const saveOrder = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: services.map(service => ({
            _id: service._id,
            order: service.order,
            published: service.published
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de l\'ordre des services');
      }

      setHasChanged(false);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="py-4">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0 fw-bold">Gestion des services</h1>
          <div className="d-flex gap-2">
            {hasChanged && (
              <button onClick={saveOrder} disabled={isSaving} className="btn btn-success">
                {isSaving ? 'Sauvegarde…' : 'Sauvegarder l\'ordre'}
              </button>
            )}
            <Link href="/admin/services/new" className="btn btn-primary">
              <i className="fa-solid fa-plus me-2"></i>Nouveau service
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-muted py-5">Aucun service trouvé</div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="table-responsive card border-0 shadow-sm">
              <table className="table align-middle mb-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th style={{width:'60px'}}>Ordre</th>
                    <th>Titre</th>
                    <th>Icône</th>
                    <th>Statut</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <DraggableServiceItem
                      key={service._id}
                      service={service}
                      index={index}
                      moveService={moveService}
                      togglePublish={togglePublish}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </DndProvider>
        )}
      </div>
    </section>
  );
} 