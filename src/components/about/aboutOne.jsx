import React from 'react';
import Partner from '../partner';
import SlideUp from '@/utils/animations/slideUp';
import SlideDown from '@/utils/animations/slideDown';
import Link from 'next/link';

const AboutOne = () => {
    return (
        <section className="about py__130" id="about">
            <div className="container">
                <div className="row justify-content-between about__title">
                    <SlideDown>
                        <div className="col-lg-10">
                            <div>
                                <span className="section-label">Pourquoi nous choisir</span>
                                <h2 className="title">
                                    Le digital, le moyen le plus rapide de stimuler votre croissance
                                </h2>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="about__title_shap position-relative">
                                <img src="/images/banner/Shape.svg" alt="" role="presentation" className="w-100" />
                            </div>
                        </div>
                    </SlideDown>
                </div>
                <div className="row justify-content-between align-items-center about__wapper">
                    <div className="col-xl-5 col-lg-6">
                        <SlideUp>
                            <div className="about__wapper_left">
                                <p>
                                    Nous donnons vie à vos idées en les transformant en solutions 
                                    digitales sur mesure pour optimiser vos processus métiers, 
                                    améliorer votre productivité et stimuler votre croissance.
                                </p>
                                <Link href="/about" className="circle">
                                    <i className="fa-solid fa-arrow-right"></i>
                                    <span>En savoir plus</span>
                                </Link>
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <SlideUp delay={2}>
                            <div className="about__wapper_center">
                                <img src="/images/about/Rectangle105.png" alt="Notre équipe en action" />
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-xl-3 col-lg-6 mt-5 mt-xl-0">
                        <SlideUp delay={3}>
                            <ul className="about__wapper_right">
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Qualité et fiabilité</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Innovation et expertise</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Évolutivité et adaptabilité</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Accompagnement personnalisé</span>
                                </li>
                            </ul>
                        </SlideUp>
                    </div>
                </div>
                <Partner />
            </div>
        </section>
    );
};

export default AboutOne;
