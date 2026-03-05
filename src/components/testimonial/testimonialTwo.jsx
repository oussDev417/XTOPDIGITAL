'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import SlideUp from '@/utils/animations/slideUp';
import SlideDown from '@/utils/animations/slideDown';

const fallbackReviews = [
    {
        id: 1,
        review: "XTOP Digital a entièrement repensé notre présence en ligne. Le nouveau site web a généré 3 fois plus de demandes de devis dès le premier mois. Une équipe à l'écoute et ultra-réactive.",
        reviewerName: 'Sophie Martin',
        reviewerPosition: 'Directrice Marketing',
        company: 'AfriCommerce',
        imgSrc: '/images/testimonail/Rectangle1.png',
        stars: 5,
        result: '+200% de leads',
    },
    {
        id: 2,
        review: "Grâce à leur expertise en SEO et marketing digital, nous sommes passés de la 5ème à la 1ère page Google en seulement 4 mois. Un retour sur investissement exceptionnel.",
        reviewerName: 'Thomas Ahouandjinou',
        reviewerPosition: 'CEO & Fondateur',
        company: 'BéninTech',
        imgSrc: '/images/testimonail/Rectangle1.png',
        stars: 5,
        result: 'Top 3 Google',
    },
    {
        id: 3,
        review: "L'application développée par XTOP Digital a transformé la gestion de notre entreprise. Nos processus sont automatisés, nos clients sont satisfaits et notre productivité a doublé.",
        reviewerName: 'Amina Dossou',
        reviewerPosition: 'Responsable des Opérations',
        company: 'LogiPro Afrique',
        imgSrc: '/images/testimonail/Rectangle1.png',
        stars: 5,
        result: 'x2 productivité',
    },
    {
        id: 4,
        review: "Un accompagnement personnalisé de A à Z. L'équipe comprend parfaitement les enjeux du marché africain et propose des solutions innovantes adaptées à notre contexte.",
        reviewerName: 'Marc Hounkpatin',
        reviewerPosition: 'Directeur Général',
        company: 'CotMedia Group',
        imgSrc: '/images/testimonail/Rectangle1.png',
        stars: 5,
        result: '+80% de CA digital',
    },
];

function createInitialAvatar(name = 'Client') {
    const initials = (name || 'Client')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('');
    const safeInitials = initials || 'CL';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a63a4"/>
            <stop offset="100%" stop-color="#1f4038"/>
          </linearGradient>
        </defs>
        <rect width="180" height="180" rx="90" fill="url(#g)"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="58" font-weight="700">${safeInitials}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function resolveAvatarSrc(src, name) {
    if (!src) return createInitialAvatar(name);
    if (src.startsWith('http://')) return src.replace('http://', 'https://');
    return src;
}

export default function TestimonialTwo() {
    const [testimonials, setTestimonials] = useState(fallbackReviews);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        async function loadTestimonials() {
            try {
                const [apiRes, usersRes] = await Promise.allSettled([
                    fetch('/api/testimonials?published=true&limit=5', { cache: 'no-store' }),
                    fetch('https://randomuser.me/api/?results=5&nat=fr&inc=name,picture'),
                ]);

                let baseTestimonials = fallbackReviews;

                if (apiRes.status === 'fulfilled' && apiRes.value.ok) {
                    const data = await apiRes.value.json();
                    if (Array.isArray(data) && data.length > 0) {
                        baseTestimonials = data.map((t, idx) => ({
                            id: idx,
                            review: t.content || t.review,
                            reviewerName: t.name || t.reviewer?.name,
                            reviewerPosition: t.role || t.reviewer?.position,
                            imgSrc: t.imgSrc || t.reviewer?.image,
                            stars: t.rating || t.stars || 5,
                            company: fallbackReviews[idx % fallbackReviews.length]?.company,
                            result: fallbackReviews[idx % fallbackReviews.length]?.result,
                        }));
                    }
                }

                if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
                    const userData = await usersRes.value.json();
                    const users = userData.results || [];
                    baseTestimonials = baseTestimonials.map((t, i) => {
                        const user = users[i];
                        if (!user) return t;
                        return {
                            ...t,
                            reviewerName: t.reviewerName && t.reviewerName !== 'Brendon Walton'
                                ? t.reviewerName
                                : `${user.name.first} ${user.name.last}`,
                            imgSrc: (t.imgSrc && !t.imgSrc.includes('Rectangle1'))
                                ? t.imgSrc
                                : user.picture.large,
                        };
                    });
                }

                setTestimonials(baseTestimonials);
            } catch {
                // fallback already set
            }
        }

        loadTestimonials();
    }, []);

    const currentTestimonial = testimonials[activeIndex] || testimonials[0];

    return (
        <section className="testi-about py__130">
            <div className="container">
                <div className="row align-items-center">
                    {/* Left: Featured photo + info */}
                    <SlideUp className="col-lg-5 mb-5 mb-lg-0">
                        <div className="testi-about__showcase">
                            <div className="testi-about__photo">
                                <img
                                    src={resolveAvatarSrc(currentTestimonial.imgSrc, currentTestimonial.reviewerName)}
                                    alt={currentTestimonial.reviewerName}
                                    key={currentTestimonial.imgSrc}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const fallback = createInitialAvatar(currentTestimonial.reviewerName);
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = fallback;
                                    }}
                                />
                                <div className="testi-about__photo-badge">
                                    <div className="testi-about__photo-stars">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i key={i} className="bi bi-star-fill"></i>
                                        ))}
                                    </div>
                                    <span>4.9/5 satisfaction</span>
                                </div>
                            </div>
                            <div className="testi-about__stats">
                                <div className="testi-about__stat">
                                    <strong>50+</strong>
                                    <span>Clients satisfaits</span>
                                </div>
                                <div className="testi-about__stat">
                                    <strong>100%</strong>
                                    <span>Projets livrés</span>
                                </div>
                            </div>
                        </div>
                    </SlideUp>

                    {/* Right: Slider */}
                    <div className="col-lg-7">
                        <div className="testi-about__content">
                            <SlideDown>
                                <span className="section-label">Témoignages clients</span>
                                <h2 className="t__54">
                                    Ce que nos clients disent de nous
                                </h2>
                            </SlideDown>

                            <div className="testi-about__slider">
                                <Swiper
                                    spaceBetween={25}
                                    slidesPerView={1}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    navigation={{
                                        nextEl: '.testi-about-next',
                                        prevEl: '.testi-about-prev',
                                    }}
                                    pagination={{
                                        renderBullet: (index, className) =>
                                            `<span class='${className}'></span>`,
                                        clickable: true,
                                        el: '.testi-about-pagination',
                                    }}
                                    loop
                                    modules={[Navigation, Pagination, Autoplay]}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                >
                                    {testimonials.map((testimonial) => (
                                        <SwiperSlide key={testimonial.id}>
                                            <div className="testi-about__card">
                                                <div className="testi-about__card-stars">
                                                    {Array.from({ length: testimonial.stars || 5 }).map((_, i) => (
                                                        <i key={i} className="bi bi-star-fill"></i>
                                                    ))}
                                                </div>
                                                <p className="testi-about__card-text">
                                                    &ldquo;{testimonial.review}&rdquo;
                                                </p>
                                                {testimonial.result && (
                                                    <div className="testi-about__card-result">
                                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                                        <span>{testimonial.result}</span>
                                                    </div>
                                                )}
                                                <div className="testi-about__card-author">
                                                    <img
                                                        src={resolveAvatarSrc(testimonial.imgSrc, testimonial.reviewerName)}
                                                        alt={testimonial.reviewerName}
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer"
                                                        onError={(e) => {
                                                            const fallback = createInitialAvatar(testimonial.reviewerName);
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = fallback;
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="testi-about__card-name">
                                                            {testimonial.reviewerName}
                                                        </p>
                                                        <small className="testi-about__card-role">
                                                            {testimonial.reviewerPosition}
                                                        </small>
                                                        {testimonial.company && (
                                                            <small className="testi-about__card-company d-block">
                                                                {testimonial.company}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="testi-about__nav">
                                    <div className="testi-about-prev testi-about__nav-btn">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </div>
                                    <div className="testi-about-pagination"></div>
                                    <div className="testi-about-next testi-about__nav-btn">
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
