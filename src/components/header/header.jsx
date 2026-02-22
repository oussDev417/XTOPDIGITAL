'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();
    const [activeNavbar, setActiveNavbar] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header className={`header header__1 ${scrolled ? 'header--scrolled' : ''}`}>
            <div className="header__bottom">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <Link href="/" className="d-flex align-items-center header__bottom_logo">
                                <img src="/images/logo.png" alt="Logo XTOP DIGITAL" />
                                <h5>XTOP DIGITAL</h5>
                            </Link>
                        </div>
                        <Navbar activeNavbar={activeNavbar} />
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-xl-block d-none">
                                <Link href="/contact" className="common__btn">
                                    <span>Devis gratuit</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                            <div className="menu__icon d-block d-xl-none" onClick={() => setActiveNavbar(!activeNavbar)}>
                                <i className="bi bi-list" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
