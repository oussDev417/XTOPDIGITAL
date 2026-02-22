import React from 'react';
import AboutOne from '@/components/about/aboutOne';
import HeroOne from '@/components/heros/heroOne';
import ProjectsOne from '@/components/projects/projectsOne';
import ServiceOne from '@/components/services/serviceOne';
import TestimonialOne from '@/components/testimonial/testimonialOne';
import ProcessSection from '@/components/processSection';
import CtaSection from '@/components/ctaSection';

export default async function Home() {
    return (
        <>
            <HeroOne />
            <AboutOne />
            <ServiceOne />
            <ProcessSection />
            <ProjectsOne isProjectUseCaseShow={true} />
            <TestimonialOne />
            <CtaSection />
        </>
    );
}
