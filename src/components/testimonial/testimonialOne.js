'use client';

import { useState, useEffect } from 'react';
import SlideDown from '@/utils/animations/slideDown';
import SlideUp from '@/utils/animations/slideUp';
import FadeIn from '@/utils/animations/fadeIn';
import { getFallbackData } from '@/utils/data-fetchers';
import Link from 'next/link';

const fallbackReviewTexts = [
    "Nous avons confié notre transformation digitale à XTOP Digital et les résultats ont largement dépassé nos attentes. Une équipe professionnelle avec une expertise remarquable. Notre chiffre d'affaires en ligne a augmenté de 45% en 3 mois.",
    "Notre site e-commerce a vu ses ventes augmenter de 60% après le travail exceptionnel réalisé par l'équipe de XTOP Digital. Leur approche est innovante, efficace et orientée résultats. Je recommande vivement !",
    "Le référencement SEO réalisé par XTOP Digital nous a propulsés en première page Google. En 6 mois, notre trafic organique a été multiplié par 3. Un investissement qui a vraiment valu la peine.",
    "L'application mobile développée par XTOP Digital a reçu des retours exceptionnels de nos utilisateurs. Interface intuitive, performances irréprochables et un suivi après livraison exemplaire.",
    "XTOP Digital a repensé notre identité visuelle et notre site web. Le résultat est époustouflant ! Nos clients nous font régulièrement des compliments sur le design. Un vrai game changer pour notre image.",
    "Grâce à la stratégie marketing mise en place par XTOP Digital, nous avons doublé notre base de clients en seulement 4 mois. Leur compréhension du marché africain est un vrai atout.",
];

const fallbackPositions = [
    "Directeur Général",
    "Responsable Marketing",
    "CEO & Fondateur",
    "Directrice E-commerce",
    "Entrepreneur",
    "Responsable Communication",
];

const fallbackCompanies = [
    "TechBénin Solutions",
    "Cotonou Market",
    "AfriDigital Group",
    "EcoShop Africa",
    "InnovateBJ",
    "MediaPro Afrique",
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
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3a63a4"/>
            <stop offset="100%" stop-color="#1f4038"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" rx="80" fill="url(#g)"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="700">${safeInitials}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function resolveAvatarSrc(src, name) {
    if (!src) return createInitialAvatar(name);
    if (src.startsWith('http://')) return src.replace('http://', 'https://');
    return src;
}

export default function TestimonialOne() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/testimonials?published=true');
                if (!response.ok) throw new Error('Erreur API');
                const data = await response.json();

                if (data && data.length > 0) {
                    const enriched = await enrichWithRandomUsers(data);
                    setTestimonials(enriched.slice(0, 6));
                } else {
                    const generated = await generateTestimonials();
                    setTestimonials(generated);
                }
            } catch (error) {
                console.error('Erreur:', error);
                try {
                    const generated = await generateTestimonials();
                    setTestimonials(generated);
                } catch {
                    const fallback = getFallbackData('testimonials');
                    setTestimonials(fallback.slice(0, 6));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <section className="testi-section" id="testimonials">
            <div className="container">
                <SlideDown className="testi-section__header">
                    <span className="section-label section-label--light text-center d-block">
                        Témoignages
                    </span>
                    <h2 className="testi-section__title">
                        Ils nous ont fait confiance et en parlent mieux que nous
                    </h2>
                    <p className="testi-section__subtitle">
                        Découvrez les retours de nos clients qui ont transformé leur présence digitale avec XTOP Digital
                    </p>
                </SlideDown>

                {isLoading ? (
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Featured testimonial */}
                        {testimonials.length > 0 && (
                            <SlideUp className="testi-featured">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-center mb-4 mb-lg-0">
                                        <div className="testi-featured__avatar">
                                            <img
                                                src={resolveAvatarSrc(testimonials[0].reviewer?.image || testimonials[0].imgSrc, testimonials[0].reviewer?.name || testimonials[0].name)}
                                                alt={testimonials[0].reviewer?.name || testimonials[0].name}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    const fallback = createInitialAvatar(testimonials[0].reviewer?.name || testimonials[0].name);
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = fallback;
                                                }}
                                            />
                                            <div className="testi-featured__avatar-ring"></div>
                                        </div>
                                        <h3 className="testi-featured__name">
                                            {testimonials[0].reviewer?.name || testimonials[0].name}
                                        </h3>
                                        <p className="testi-featured__role">
                                            {testimonials[0].reviewer?.position || testimonials[0].role}
                                        </p>
                                        {testimonials[0].company && (
                                            <span className="testi-featured__company">
                                                {testimonials[0].company}
                                            </span>
                                        )}
                                        <div className="testi-featured__stars">
                                            {Array.from({ length: testimonials[0].stars || 5 }).map((_, i) => (
                                                <i key={i} className="bi bi-star-fill"></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="testi-featured__content">
                                            <i className="fa-solid fa-quote-left testi-featured__quote-icon"></i>
                                            <p className="testi-featured__text">
                                                {testimonials[0].review || testimonials[0].content}
                                            </p>
                                            {testimonials[0].result && (
                                                <div className="testi-featured__result">
                                                    <i className="fa-solid fa-chart-line"></i>
                                                    <span>{testimonials[0].result}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SlideUp>
                        )}

                        {/* Testimonial grid */}
                        {testimonials.length > 1 && (
                            <div className="testi-grid">
                                {testimonials.slice(1, 7).map((testimonial, index) => (
                                    <FadeIn key={index} delay={index + 1}>
                                        <div
                                            className={`testi-card ${activeCard === index ? 'testi-card--active' : ''}`}
                                            onMouseEnter={() => setActiveCard(index)}
                                            onMouseLeave={() => setActiveCard(null)}
                                        >
                                            <div className="testi-card__stars">
                                                {Array.from({ length: testimonial.stars || 5 }).map((_, i) => (
                                                    <i key={i} className="bi bi-star-fill"></i>
                                                ))}
                                            </div>
                                            <p className="testi-card__text">
                                                &ldquo;{testimonial.review || testimonial.content}&rdquo;
                                            </p>
                                            {testimonial.result && (
                                                <div className="testi-card__result">
                                                    <i className="fa-solid fa-arrow-trend-up"></i>
                                                    <span>{testimonial.result}</span>
                                                </div>
                                            )}
                                            <div className="testi-card__author">
                                                <img
                                                    src={resolveAvatarSrc(testimonial.reviewer?.image || testimonial.imgSrc, testimonial.reviewer?.name || testimonial.name)}
                                                    alt={testimonial.reviewer?.name || testimonial.name || 'Client'}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => {
                                                        const fallback = createInitialAvatar(testimonial.reviewer?.name || testimonial.name || 'Client');
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = fallback;
                                                    }}
                                                />
                                                <div>
                                                    <p className="testi-card__name">
                                                        {testimonial.reviewer?.name || testimonial.name}
                                                    </p>
                                                    <small className="testi-card__role">
                                                        {testimonial.reviewer?.position || testimonial.role}
                                                    </small>
                                                    {testimonial.company && (
                                                        <small className="testi-card__company d-block">
                                                            {testimonial.company}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <SlideUp className="testi-section__cta">
                            <Link href="/contact" className="common__btn buttons_cta">
                                <span>Rejoignez nos clients satisfaits</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </SlideUp>
                    </>
                )}
            </div>
        </section>
    );
}

async function enrichWithRandomUsers(testimonials) {
    try {
        const count = Math.min(testimonials.length, 6);
        const res = await fetch(
            `https://randomuser.me/api/?results=${count}&nat=fr&inc=name,picture`
        );
        if (!res.ok) return testimonials;
        const data = await res.json();
        const users = data.results;

        return testimonials.map((t, i) => {
            const user = users[i];
            const hasImage = t.reviewer?.image || t.imgSrc;
            const hasName = t.reviewer?.name || t.name;

            if (!user) return t;

            return {
                ...t,
                reviewer: {
                    ...t.reviewer,
                    name: hasName || `${user.name.first} ${user.name.last}`,
                    image: hasImage || user.picture.large,
                    position: t.reviewer?.position || t.role || fallbackPositions[i % fallbackPositions.length],
                },
                company: t.company || fallbackCompanies[i % fallbackCompanies.length],
            };
        });
    } catch {
        return testimonials;
    }
}

async function generateTestimonials() {
    const res = await fetch(
        'https://randomuser.me/api/?results=6&nat=fr&inc=name,picture'
    );
    if (!res.ok) throw new Error('API indisponible');
    const data = await res.json();

    return data.results.map((user, i) => ({
        stars: 5,
        review: fallbackReviewTexts[i],
        reviewer: {
            name: `${user.name.first} ${user.name.last}`,
            position: fallbackPositions[i],
            image: user.picture.large,
        },
        company: fallbackCompanies[i],
        result: [
            "+45% de CA en ligne",
            "+60% de ventes",
            "x3 trafic organique",
            "4.9/5 note utilisateurs",
            "+200% de leads",
            "x2 base clients",
        ][i],
    }));
}
