'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/pageTitle';
import ServiceThree from '@/components/services/serviceThree';
import { getFallbackData } from '@/utils/data-fetchers';

export default function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/services?published=true');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des services');
        }
        
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Erreur:', error);
        // Utiliser les données statiques comme fallback en cas d'erreur
        const fallbackServices = getFallbackData('services');
        setServices(fallbackServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <PageTitle title={"Services"} currentPage={"Services"} />
      <ServiceThree services={services} isLoading={isLoading} />
    </>
  );
}