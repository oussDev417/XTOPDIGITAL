'use client';
import { useEffect, useState } from 'react';
import { partnerOneLogos } from '@/db/partnerOneLogos';

export default function Partner({ data = [], className = '' }) {
  const [logos, setLogos] = useState(data.length > 0 ? data : partnerOneLogos);

  useEffect(() => {
    if (data.length > 0) return;
    async function fetchLogos() {
      try {
        const res = await fetch('/api/partners', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const incoming = json.logos || [];
        if (incoming.length > 0) {
          setLogos(incoming);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchLogos();
  }, [data]);

  if (!logos || logos.length === 0) return null;

  return (
    <div className={`partner ${className}`}>
      <div className="partner__header text-center">
        <span className="section-label section-label--light">Ils nous font confiance</span>
        <h3 className="partner__title">Des marques ambitieuses qui avancent avec XTOP DIGITAL</h3>
      </div>
      <div className="partner__wapper">
        <div className="partner__content">
          {[...logos, ...logos].map((logoSrc, index) => {
            const src = typeof logoSrc === 'string' ? logoSrc : logoSrc.imageUrl;
            return (
              <div className="partner__item" key={index}>
                <img
                  src={src}
                  alt={`Logo partenaire ${index + 1}`}
                  className="partner__logo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0.3';
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}