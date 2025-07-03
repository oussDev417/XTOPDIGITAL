'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import SlideUp from '@/utils/animations/slideUp';
import SlideDown from '@/utils/animations/slideDown';
import { testimonialsTwoData } from '@/db/testimonialsTwoData';

export default function TestimonialTwo() {
    const [testimonials, setTestimonials] = useState(testimonialsTwoData);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch('/api/testimonials?published=true&limit=5', { cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials(
                        data.map((t, idx) => ({
                            id: idx,
                            review: t.content,
                            reviewerName: t.name,
                            reviewerPosition: t.role,
                            imgSrc: t.imgSrc,
                            quotesImgSrc: '/images/testimonail/quotes2.svg',
                            stars: t.rating || 5,
                        }))
                    );
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchTestimonials();
    }, []);

    return (
        <section className="testimonial testimonial__2 py__130">
            <div className="container">
                <div className="row">
                    <SlideUp className="col-lg-6">
                        <img src="/images/testimonail/CEO.png" alt="img" className="w-100" />
                    </SlideUp>
                    <div className="col-lg-6 mt-4 mt-lg-0">
                        <div className="position-relative">
                            {/* title Start */}
                            <SlideDown className="testimonial__title">
                                <h1 className="t__54">
                                    Ce que nos clients disent de nous
                                </h1>
                            </SlideDown>
                            {/* title End */}
                            <div className="testimonial__wapper">
                                <Swiper
                                    spaceBetween={25}
                                    slidesPerView={1}
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
                                    className="testimonial__slides_2">
                                    {testimonials.map((testimonial) => (
                                        <SwiperSlide key={testimonial.id}>
                                            <div className="slide">
                                                <div className="d-flex gap-2 star">
                                                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                                                        <i key={i} className="bi bi-star-fill" />
                                                    ))}
                                                </div>
                                                <p className="review">{testimonial.review}</p>
                                                <div className="d-flex justify-content-between">
                                                    <div className="d-flex gap-4 reviewer__info">
                                                        <img src={testimonial.imgSrc} alt={testimonial.reviewerName} />
                                                        <div>
                                                            <p>{testimonial.reviewerName}</p>
                                                            <small>{testimonial.reviewerPosition}</small>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <img src={testimonial.quotesImgSrc} alt="quotes" className="quotes" />
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    <div className='d-flex gap-3 mt-4'>
                                        <div className='prev-slide slide__nav'><i className="fa-solid fa-arrow-left"></i></div>
                                        <div className='testimonial-pagination d-flex gap-3'></div>
                                        <div className='next-slide slide__nav'><i className="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}