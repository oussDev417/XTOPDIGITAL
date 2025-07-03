import React from 'react'
import Partner from '../partner'
import SlideUp from '@/utils/animations/slideUp'
import SlideDown from '@/utils/animations/slideDown'
import Link from 'next/link'

const AboutOne = () => {
    return (
        <section className="about py__130" id="about">
            <div className="container">
                <div className="row justify-content-between about__title">
                    <SlideDown>
                        <div className="col-lg-10">
                            <div>
                                <h1 className="title">
                                    Des Solutions Sans Limites, Pour des Résultats Sans Frontières
                                </h1>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="about__title_shap position-relative">
                                <img src="/images/banner/Shape.svg" alt="img" className="w-100" />
                            </div>
                        </div>
                    </SlideDown>
                </div>
                <div className="row justify-content-between align-items-center about__wapper">
                    <div className="col-xl-5 col-lg-6">
                        <SlideUp>
                            <div className="about__wapper_left">
                                <p>
                                    Chez XTOP, nous croyons qu'aucune idée n'est trop ambitieuse, aucun projet trop complexe. Qu'il s'agisse d'un site web simple, d'une application mobile innovante, d'un chatbot intelligent ou d'un système métier sur mesure, nous matérialisons vos visions, quelle que soit votre industrie ou votre localisation.
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
                                <img src="/images/about/Rectangle105.png" alt="img" />
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-xl-3 col-lg-6 mt-5 mt-xl-0">
                        <SlideUp delay={3}>
                            <ul className="about__wapper_right">
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Des solutions sur mesure</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Technologies de pointe</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Flexibilité totale</span>
                                </li>
                            </ul>
                        </SlideUp>
                    </div>
                </div>
                <Partner />
            </div>
        </section>

    )
}

export default AboutOne