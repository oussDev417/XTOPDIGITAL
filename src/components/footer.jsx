'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="footer">
            <div className="container">
                {/* Logo and social */}
                <div className="row footer__lo_co mb-5">
                    <div className="col-12">
                        <div className="d-flex justify-content-center">
                            <Link href="/" className="d-flex align-items-center footer__logo">
                                <img src="/images/logo_white.svg" alt="Logo XTOP DIGITAL" />
                                <h5>XTOP DIGITAL</h5>
                            </Link>
                        </div>
                        <p className="text-center footer__tagline">
                            Votre partenaire digital de confiance au Bénin
                        </p>
                        <ul className="d-flex justify-content-center gap-3 footer__socal">
                            <li>
                                <a href="https://www.facebook.com/people/XTOP-Digital/61576689539750/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <i className="fa-brands fa-facebook-f" />
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/company/xtop-digital" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <i className="fa-brands fa-linkedin-in" />
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com/xtopdigital" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <i className="fa-brands fa-instagram" />
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/xtopdigital" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                                    <i className="fa-brands fa-x-twitter" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <hr className="footer__border" />
                
                {/* Info */}
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
                                    <img src="/icons/Frame5.svg" alt="Email" />
                                    <p>contact@xtopdigital.com</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame6.svg" alt="Téléphone" />
                                    <p>+229 01 64 22 33 28</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame7.svg" alt="Horaires" />
                                    <p>Lun - Ven 10:00 - 18:00</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Liens rapides</h3>
                            <ul>
                                <li><Link href="/">Accueil</Link></li>
                                <li><Link href="/services">Nos services</Link></li>
                                <li><Link href="/about">À propos</Link></li>
                                <li><Link href="/projects">Réalisations</Link></li>
                                <li><Link href="/blog">Blog</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Aide</h3>
                            <ul>
                                <li><Link href="/contact">Contactez-nous</Link></li>
                                <li><Link href="/faq">FAQ</Link></li>
                                <li><Link href="/pricing">Tarifs</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="row footer__copyright">
                    <div className="col-12">
                        <hr className="footer__border" />
                        <p className="text-center">
                            © Copyright {new Date().getFullYear()} Tous droits réservés par <Link href="/">XTOP DIGITAL</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
