'use client'
import React, { useState } from 'react'
import TopHeader from './topHeader'
import Navbar from './navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
    // Masquer le header sur toutes les pages d'administration
    if (pathname.startsWith('/admin')) {
        return null
    }

    const [activeNavbar, setActiveNavebar] = useState(false)

    return (
        <header className="header header__1">
            <div className="header__bottom">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <Link href="/" className="d-flex align-items-center header__bottom_logo">
                                <img src="/images/logo.png" alt="img" />
                                <h5>XTOP DIGITAL</h5>
                            </Link>
                        </div>
                        <Navbar activeNavbar={activeNavbar}/>
                        <div className="d-xl-block d-none">
                            <Link href={"/contact"} className="common__btn">
                                <span> Contactez-nous</span>
                                <img src="/icons/arrow-up-right.svg" alt="img" />
                            </Link>
                        </div>
                        <div className="menu__icon d-block d-xl-none" onClick={()=>setActiveNavebar(!activeNavbar)}>
                            <i className="bi bi-list" />
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header