'use client';

import React, { useEffect, useRef, useState } from 'react';

const SlideUp = ({ children, delay = 1, className }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);
    
    const delayTime = delay === 1 ? 0 : 0.1 * delay;
    
    const style = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        transitionDelay: `${delayTime}s`
    };
    
    return (
        <div 
            ref={ref} 
            className={className} 
            style={style}
        >
            {children}
        </div>
    );
};

export default SlideUp;