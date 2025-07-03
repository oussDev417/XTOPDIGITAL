'use client';
import { useEffect, useState } from 'react';

export default function Partner({ data = [], className = '' }) {
  const [logos, setLogos] = useState(data);

  useEffect(() => {
    if (data.length > 0) return;
    async function fetchLogos() {
      try {
        const res = await fetch('/api/partners', { cache: 'no-store' });
        const json = await res.json();
        setLogos(json.logos || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchLogos();
  }, [data]);

  if (!logos || logos.length === 0) return null;

  return (
    <div className={`partner ${className}`}>
      <div className="partner__wapper">
        <div className="partner__content">
          {logos.map((logoSrc, index) => {
            const src = typeof logoSrc === 'string' ? logoSrc : logoSrc.imageUrl;
            return (
              <div className="slide" key={index}>
                <img src={src} alt={`Partner logo ${index + 1}`} className="partner__logo" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}