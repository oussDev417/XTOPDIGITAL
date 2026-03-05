import SlideUp from '@/utils/animations/slideUp';
import Link from 'next/link';
import React from 'react';

const HeroOne = () => {
    return (
        <section className="banner overflow-hidden">
            <div className="container position-relative">
                <div className="row align-items-center">
                    <div className="col-lg-8 order-1">
                        <div className="banner__content">
                            <div className="banner__content_title">
                                <SlideUp>
                                    <div className="banner__badge">
                                        <span className="banner__badge_dot"></span>
                                        <span>+50 entreprises nous font confiance</span>
                                    </div>
                                </SlideUp>
                                <SlideUp delay={1}>
                                    <h1>
                                        Votre agence digitale
                                        <span className="text-highlight"> qui transforme </span>
                                        vos idées en résultats
                                    </h1>
                                </SlideUp>
                                <SlideUp delay={2}>
                                    <p>
                                        Nous concevons des solutions digitales sur mesure — sites web, applications, 
                                        SEO et marketing — pour accélérer votre croissance et automatiser vos processus métiers.
                                    </p>
                                </SlideUp>
                            </div>
                            <SlideUp delay={3} className="buttons d-sm-flex align-items-center">
                                <Link href="/contact" className="common__btn buttons_cta">
                                    <span>Demander un devis gratuit</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link href="/services" className="common__btn buttons_outline mt-4 mt-sm-0">
                                    <span>Découvrir nos services</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </SlideUp>
                            <SlideUp delay={4} className="banner__content_number d-flex justify-content-between">
                                <div>
                                    <h4>5+</h4>
                                    <p>Ans d&apos;expérience</p>
                                </div>
                                <div>
                                    <h4>100%</h4>
                                    <p>Satisfaction client</p>
                                </div>
                                <div>
                                    <h4>50+</h4>
                                    <p>Projets livrés</p>
                                </div>
                            </SlideUp>
                            <div className="banner__mobile_image d-block d-lg-none">
                                <img
                                    src="/images/banner/Rectangle96.png"
                                    alt="Équipe XTOP DIGITAL au travail"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 order-2 mt-4 mt-lg-0 d-none d-lg-block">
                        <div className="banner__right">
                            <img src="/images/banner/Shape.svg" alt="" className="bg__shap" role="presentation" />
                            <img src="/images/banner/Video.svg" alt="" className="bg__video" role="presentation" />
                            <div>
                                <img src="/images/banner/Rectangle96.png" alt="Équipe XTOP DIGITAL au travail" className="bg__img" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="position-absolute top-0 h-100 w-100">
                    <div className="banner__shap_1 banner__shap" />
                    <div className="banner__shap_2 banner__shap" />
                    <div className="banner__shap_3 banner__shap" />
                    <div className="banner__shap_4 banner__shap" />
                </div>
            </div>
        </section>
    );
};

export default HeroOne;
