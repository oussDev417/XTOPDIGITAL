'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SlideDown from '@/utils/animations/slideDown';
import SlideUp from '@/utils/animations/slideUp';
import { getFallbackData } from '@/utils/data-fetchers';

export default function ServiceOne() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/services?limit=6');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des services');
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Erreur:', error);
        const fallbackServices = getFallbackData('services');
        setServices(fallbackServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <section className="services py__130" id="services">
        <div className="container position-relative">
          <SlideDown className="d-lg-flex justify-content-between align-items-center services__title">
            <h2 className="title">Nos Services</h2>
          </SlideDown>
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services py__130" id="services">
      <div className="container position-relative">
        <SlideDown className="d-lg-flex justify-content-between align-items-center services__title">
          <div>
            <span className="section-label section-label--light">Ce que nous faisons</span>
            <h2 className="title">Des solutions digitales qui font la différence</h2>
          </div>
          <Link href="/services" className="common__btn mt-4 mt-lg-0">
            <span>Voir tous les services</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </SlideDown>

        <div className="services__wapper">
          <div className="services__wapper_list">
            {services.map((service, index) => (
              <SlideUp delay={index + 1} key={service._id || service.id}>
                <Link href={`/service-details/${service.slug || service.id}`} className="service__name">
                  <sup>{`0${service.order || index + 1}`}</sup>
                  {service.title}
                </Link>
                <p className="describe">{service.description}</p>
                <Link href={`/service-details/${service.slug || service.id}`} className="icon">
                  <img src="/icons/arrow-up-right-yellow.svg" alt="" className="yellow" />
                  <img src="/icons/arrow-up-rignt-black.svg" alt="" className="black" />
                </Link>
              </SlideUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
