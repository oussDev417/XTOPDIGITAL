'use client';

import Link from 'next/link';
import SlideUp from '@/utils/animations/slideUp';

const CtaSection = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <SlideUp>
                    <div className="cta-section__inner">
                        <div className="row align-items-center">
                            <div className="col-lg-8 mb-4 mb-lg-0">
                                <h2 className="cta-section__title">
                                    Prêt à transformer votre entreprise avec le digital ?
                                </h2>
                                <p className="cta-section__text">
                                    Discutons de votre projet. Premier échange gratuit et sans engagement.
                                </p>
                            </div>
                            <div className="col-lg-4 text-lg-end">
                                <Link href="/contact" className="common__btn cta-section__btn">
                                    <span>Demander un devis gratuit</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </section>
    );
};

export default CtaSection;
