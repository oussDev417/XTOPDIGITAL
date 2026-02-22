import FaqSection from '@/components/faqSection';
import PageTitle from '@/components/pageTitle';
import React from 'react';

export const metadata = {
    title: 'FAQ',
    description:
        'Questions fréquentes sur nos services digitaux : création de sites web, SEO, marketing digital et développement d\'applications.',
    alternates: {
        canonical: '/faq',
    },
};

const Faq = () => {
    return (
        <>
            <PageTitle title="Questions fréquentes" currentPage="FAQ" />
            <FaqSection />
        </>
    );
};

export default Faq;
