'use client';
import { useEffect, useState } from 'react';

export default function GoogleMap() {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch('/api/contact', { cache: 'no-store' });
                const data = await res.json();
                if (data.detail && data.detail.mapEmbedUrl) {
                    setUrl(data.detail.mapEmbedUrl);
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchDetail();
    }, []);

    return (
        <div className="map py__130">
            <iframe
                src={url || 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28616.60639112505!2d88.95574979644482!3d26.29164265582622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1701339556449!5m2!1sen!2sbd'}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    )
}