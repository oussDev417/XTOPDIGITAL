'use client';

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const pathname = usePathname()
    // Ne pas afficher sur les pages d'administration
    if (pathname.startsWith('/admin')) {
        return null
    }

    return (
        <footer className="footer">
            <div className="container">
                {/* Subscribe Form */}
                <div className="subscribe">
                    <div className="row">
                        <div className="col-lg-8">
                            <h2>Abonnez-vous à notre newsletter et obtenez plus d'informations</h2>
                        </div>
                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div>
                                <input type="text" placeholder="Your Email" />
                                <button className="common__btn">
                                    <span>S'abonner maintenant</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Subscribe Form */}
                {/* -------Logo and socal icon */}
                <div className="row footer__lo_co">
                    <div className="col-12">
                        <div className="d-flex justify-content-center">
                            <Link href={"#"} className="d-flex align-items-center footer__logo">
                                <img src="/images/logo_white.svg" alt="img" />
                                <h5>XTOP DIGITAL</h5>
                            </Link>
                        </div>
                        <ul className="d-flex justify-content-center gap-3 footer__socal">
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-facebook-f" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-pinterest-p" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-instagram" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-twitter" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* -------Logo and socal icon */}
                <hr className="footer__border" />
                {/* ---- Info */}
                <div className="row footer__info">
                    <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                        <div className="footer__info_address">
                            <h3 className="footer__info_group">Adresse</h3>
                            <p>Bénin, Cotonou</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Contact</h3>
                            <ul className="footer__info_contact">
                                <li>
                                    <img src="/icons/Frame5.svg" alt="img" />
                                    <p>contact@xtopdigital.com</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame6.svg" alt="img" />
                                    <p>+229 01 64 22 33 28</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame7.svg" alt="img" />
                                    <p>Lun - Ven 10:00 - 18:00</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Liens rapides</h3>
                            <ul>
                                <li>
                                    <Link href={"#"}>Accueil</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>Nos services</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>À propos</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Aide</h3>
                            <ul>
                                <li>
                                    <Link href={"#"}>Contactez-nous</Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                {/* ---- Info */}
                <div className="row footer__copyright">
                    <div className="col-12">
                        <hr className="footer__border" />
                        <p className="text-center">
                            © Copyright 2025 Tous droits réservés par <Link href={"/"}>XTOP DIGITAL</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
