'use client';

import React, { useState } from 'react';
import ServiceCard from './serviceCard';
import SlideUp from '@/utils/animations/slideUp';

export default function ServiceThree({ services = [], isLoading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(services.length / servicesPerPage);
  
  // Obtenir les services pour la page actuelle
  const getCurrentPageServices = () => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    return services.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="services all__services py__130">
        <div className="container">
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  const formattedPageNumbers = Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    return pageNumber < 10 ? `0${pageNumber}` : `${pageNumber}`;
  });

  return (
    <section className="services all__services py__130">
      <div className="container">
        <div className="row">
          {getCurrentPageServices().map((service, index) => (
            <SlideUp
              key={service._id || service.id}
              className="col-xl-4 col-md-6 mb-5 d-flex"
              delay={(index % 3) + 1} // Animation delay based on position
            >
              <ServiceCard 
                imgSrc={service.imgSrc || `/images/services/service-${service.order || index + 1}.png`}
                title={service.title}
                description={service.description}
                slug={service.slug || service._id || service.id}
              />
            </SlideUp>
          ))}
        </div>

        {totalPages > 1 && (
          <SlideUp className="custom__pagination">
            <div className="row">
              <div className="col-12">
                <ul className="d-flex justify-content-center">
                  <li 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'disabled' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </li>
                  
                  {formattedPageNumbers.map((pageNum, index) => (
                    <li 
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      {pageNum}
                    </li>
                  ))}
                  
                  <li 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'disabled' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                  </li>
                </ul>
              </div>
            </div>
          </SlideUp>
        )}
      </div>
    </section>
  );
} 