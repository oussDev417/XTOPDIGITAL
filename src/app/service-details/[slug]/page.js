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
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <PageTitle title="Service non trouvé" currentPage="Erreur" />
        <div className="container py-5">
          <div className="text-center">
            <h2 className="h2 mb-4">Le service demandé n'a pas été trouvé</h2>
            <p>Veuillez vérifier l'URL ou revenir à la liste des services.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        .service-content {
          color: #212529 !important;
          line-height: 1.8;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }
        .service-content h1, .service-content h2, .service-content h3, 
        .service-content h4, .service-content h5, .service-content h6 {
          color: #1a1a1a !important;
          margin-bottom: 1.2rem;
          margin-top: 2rem;
          font-weight: 600;
        }
        .service-content h1 {
          font-size: 2.5rem;
          border-bottom: 3px solid #0d6efd;
          padding-bottom: 0.5rem;
        }
        .service-content h2 {
          font-size: 2rem;
          color: #0d6efd !important;
        }
        .service-content h3 {
          font-size: 1.5rem;
          color: #495057 !important;
        }
        .service-content p {
          color: #212529 !important;
          margin-bottom: 1.5rem;
          text-align: justify;
          font-size: 16px;
          line-height: 1.8;
        }
        .service-content ul, .service-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .service-content li {
          color: #212529 !important;
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }
        .service-content strong, .service-content b {
          color: #1a1a1a !important;
          font-weight: 700;
        }
        .service-content em, .service-content i {
          color: #495057 !important;
          font-style: italic;
        }
        .service-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .service-content blockquote {
          border-left: 4px solid #0d6efd;
          background-color: #f8f9fa;
          padding: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #495057 !important;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .service-content a {
          color: #0d6efd !important;
          text-decoration: underline;
        }
        .service-content a:hover {
          color: #0056b3 !important;
        }
        .service-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        .service-content table th,
        .service-content table td {
          border: 1px solid #dee2e6;
          padding: 0.75rem;
          text-align: left;
          color: #212529 !important;
        }
        .service-content table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .service-content code {
          background-color: #f8f9fa;
          color: #e83e8c;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .service-content pre {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .service-content pre code {
          background: none;
          color: #212529;
          padding: 0;
        }
      `}</style>
      
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
          
          {/* Affichage du contenu détaillé formaté */}
          {service.content && (
            <div className="service-content-section pt__50">
              <SlideUp>
                <div 
                  className="service-content"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </SlideUp>
            </div>
          )}
          
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