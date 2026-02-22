import AboutOne from '@/components/about/aboutOne';
import HomeBlog from '@/components/blogs/homeBlog';
import PageTitle from '@/components/pageTitle';
import ProjectsOne from '@/components/projects/projectsOne';
import TestimonialTwo from '@/components/testimonial/testimonialTwo';
import React from 'react';

export const metadata = {
    title: 'À propos',
    description:
        'Découvrez XTOP DIGITAL, votre agence digitale de confiance à Cotonou, Bénin. Plus de 5 ans d\'expertise en création de solutions digitales innovantes.',
    alternates: {
        canonical: '/about',
    },
};

const About = () => {
    return (
        <>
            <PageTitle title="À propos de nous" currentPage="À propos" />
            <AboutOne />
            <ProjectsOne />
            <TestimonialTwo />
            <HomeBlog />
        </>
    );
};

export default About;
