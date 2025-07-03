'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import SlideDown from '@/utils/animations/slideDown';
import SlideUp from '@/utils/animations/slideUp';
import { getFallbackData } from '@/utils/data-fetchers';
import VideoTestimonial from './videoTestimonial';

export default function TestimonialOne() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/testimonials?published=true');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des témoignages');
        }
        
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Erreur:', error);
        // Utiliser les données statiques comme fallback en cas d'erreur
        const fallbackTestimonials = getFallbackData('testimonials');
        setTestimonials(fallbackTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="testimonial py__130">
      <div className="container position-relative">
        {/* title Start */}
        <SlideDown className="testimonial__title">
          <h1 className="title text-center">
            Ce que nos clients disent de nos services
          </h1>
        </SlideDown>
        {/* title End */}
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center my-12">
            <p>Aucun témoignage disponible pour le moment.</p>
          </div>
        ) : (
          <SlideUp className="testimonial__wapper">
            <Swiper
              spaceBetween={25}
              breakpoints={{
                0: {
                  slidesPerView: 1
                },
                768: {
                  slidesPerView: 2
                }
              }}
              navigation={{
                nextEl: ".next-slide",
                prevEl: ".prev-slide"
              }}
              pagination={{
                renderBullet: function (index, className) {
                  return `<span class='${className}'>0${index + 1}</span>`;
                },
                clickable: true,
                bulletClass: 'slide-dots',
                bulletActiveClass: 'slide-dots-active',
                el: ".testimonial-pagination"
              }}
              loop
              modules={[Navigation, Pagination]}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="slide">
                  <div className="d-flex gap-2 star">
                    {Array.from({ length: testimonial.stars || 5 }).map((_, i) => (
                      <i key={i} className="bi bi-star-fill" />
                    ))}
                  </div>
                  <p className="review">{testimonial.review || testimonial.content}</p>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-4 reviewer__info">
                      <img 
                        src={testimonial.reviewer?.image || testimonial.imgSrc || "/images/testimonials/avatar-placeholder.png"} 
                        alt={testimonial.reviewer?.name || testimonial.name} 
                      />
                      <div>
                        <p>{testimonial.reviewer?.name || testimonial.name}</p>
                        <small>{testimonial.reviewer?.position || testimonial.role}</small>
                      </div>
                    </div>
                    <div>
                      <img src={testimonial.quoteImage || "/images/testimonail/quotes1.svg"} alt="quote" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className='d-flex justify-content-center gap-3 mt-4'>
                <div className='prev-slide slide__nav'><i className="fa-solid fa-arrow-left"></i></div>
                <div className='testimonial-pagination d-flex gap-3'></div>
                <div className='next-slide slide__nav'><i className="fa-solid fa-arrow-right"></i></div>
              </div>
            </Swiper>
          </SlideUp>
        )}
        
      </div>
    </section>
  );
}