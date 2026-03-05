'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    if (pathname.startsWith('/admin')) {
        return null;
    }

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                {/* Newsletter CTA */}
                <div className="footer__newsletter d-none d-md-block">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="footer__newsletter_title">
                                Prêt à booster votre présence digitale ?
                            </h2>
                            <p className="footer__newsletter_text">
                                Recevez nos conseils exclusifs et les dernières tendances du digital directement dans votre boîte mail.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <form onSubmit={handleNewsletterSubmit} className="footer__newsletter_form">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    aria-label="Adresse email pour la newsletter"
                                />
                                <button type="submit" className="common__btn">
                                    <span>{subscribed ? '✓ Inscrit !' : "S'inscrire"}</span>
                                    {!subscribed && <i className="fa-solid fa-arrow-right"></i>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

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
                                <a href="https://facebook.com/xtopdigital" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <i className="fa-brands fa-facebook-f" />
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/company/xtopdigital" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
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
