'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/pageTitle';
import SlideUp from '@/utils/animations/slideUp';
import { getFallbackData } from '@/utils/data-fetchers';
import { useParams } from 'next/navigation';

export default function ServiceDetails() {
  const params = useParams();
  const { slug } = params;
  
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${slug}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des détails du service');
        }
        
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
        
        // Tenter de trouver le service dans les données de fallback
        const fallbackServices = getFallbackData('services');
        const fallbackService = fallbackServices.find(s => s.slug === slug || s.id === slug);
        
        if (fallbackService) {
          setService(fallbackService);
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchServiceDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Détails du service" currentPage="Détails du service" />
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <PageTitle title="Service non trouvé" currentPage="Erreur" />
        <div className="container py-20">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Le service demandé n'a pas été trouvé</h2>
            <p>Veuillez vérifier l'URL ou revenir à la liste des services.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title={service.title} currentPage="Détails du service" />
      <article className="service__details py__130">
        <div className="container">
          <img 
            src={service.detailImage || service.imgSrc || "/images/services/service.png"} 
            alt={service.title} 
            className="w-100 thumb__img" 
          />
          <div className="first__para pt__60">
            <SlideUp>
              <h2 className="t__54">
                {service.title}
              </h2>
            </SlideUp>
            <p>
              {service.fullDescription || service.description}
            </p>
            {service.additionalDescription && (
              <p>{service.additionalDescription}</p>
            )}
          </div>
          {service.features && service.features.image && (
            <div className="second__para pt__60">
              <div className="row justify-content-between align-items-center">
                <SlideUp className="col-md-6">
                  <img 
                    src={service.features.image} 
                    alt={service.title} 
                    className="w-100" 
                  />
                </SlideUp>
                <SlideUp className="col-md-5 mt-4 mt-md-0">
                  <div>
                    <h4 className="t__28">
                      {service.features.title || "Nos services de qualité"}
                    </h4>
                    <ul>
                      {(service.features.list || ["Qualité professionnelle", "Support réactif", "Solutions sur mesure"]).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </SlideUp>
              </div>
            </div>
          )}
          <div className="thred__para pt__50">
            <h5 className="t__28">Avantages du service</h5>
            <p>
              {service.benefits?.description || "Notre équipe d'experts vous offre des solutions personnalisées adaptées à vos besoins spécifiques, avec une approche orientée résultats et un suivi constant."}
            </p>
            <SlideUp>
              <ul className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                {(service.benefits?.list || ["Prix compétitifs", "Disponibilité 24/7", "Experts qualifiés", "Satisfaction garantie"]).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </SlideUp>
            <p>
              {service.conclusion || "Notre approche méthodique et notre expertise vous garantissent des résultats optimaux. Nous nous engageons à fournir un service de qualité qui répond parfaitement à vos attentes."}
            </p>
          </div>
          {service.tips && (
            <div className="fourt__para">
              <h5 className="t__28">Conseils et astuces</h5>
              <p>
                {service.tips}
              </p>
            </div>
          )}
        </div>
      </article>
    </>
  );
} 