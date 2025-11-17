import React from 'react'
import AboutOne from '@/components/about/aboutOne'
import HeroOne from '@/components/heros/heroOne'
import ProjectsOne from '@/components/projects/projectsOne'
import ServiceOne from '@/components/services/serviceOne'
import TestimonialOne from '@/components/testimonial/testimonialOne'

export default async function Home() {
    return (
        <>
            <HeroOne />
            <AboutOne />
            <ServiceOne />
            <ProjectsOne isProjectUseCaseShow={true} />
            
            <TestimonialOne />
        </>
    )
}