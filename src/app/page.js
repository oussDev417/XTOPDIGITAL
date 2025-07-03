import React from 'react'
import AboutOne from '@/components/about/aboutOne'
import HomeBlog from '@/components/blogs/homeBlog'
import HeroOne from '@/components/heros/heroOne'
import PricingTable from '@/components/pricing/pricingTable'
import ProjectsOne from '@/components/projects/projectsOne'
import ServiceOne from '@/components/services/serviceOne'
import TestimonialOne from '@/components/testimonial/testimonialOne'
import SlideUp from '@/utils/animations/slideUp'

async function getPricingPlans() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
  try {
    const res = await fetch(`${baseUrl}/api/pricing`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.plans || [];
  } catch {
    return [];
  }
}

export default async function Home() {
    const plans = await getPricingPlans();
    return (
        <>
            <HeroOne />
            <AboutOne />
            <ServiceOne />
            <ProjectsOne isProjectUseCaseShow={true} />
            <section className="pricing">
                <div className="container">
                    <SlideUp className="testimonial__title">
                        <h1 className="title text-center">
                            Prenez un coup d'oeil au plan de prix parfait pour commencer
                        </h1>
                    </SlideUp>
                    <PricingTable plans={plans} />
                </div>
            </section>
            <TestimonialOne />
            <HomeBlog className={'py__130'}/>
        </>
    )
}