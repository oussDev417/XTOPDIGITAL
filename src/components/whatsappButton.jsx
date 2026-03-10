'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WhatsAppButton = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (pathname.startsWith('/admin')) return null;

    const phoneNumber = '2290164223328';
    const message = encodeURIComponent(
        "Bonjour XTOP DIGITAL ! Je suis intéressé(e) par vos services digitaux. Pouvez-vous m'en dire plus ?"
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`whatsapp-float ${isVisible ? 'whatsapp-float--visible' : ''}`}
            aria-label="Contactez-nous sur WhatsApp"
        >
            <i className="fa-brands fa-whatsapp" />
            <span className="whatsapp-float__label">Discutons !</span>
        </a>
    );
};

export default WhatsAppButton;
