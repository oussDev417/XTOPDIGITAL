import ContactInfo from '@/components/contactInfo';
import GoogleMap from '@/components/googleMap';
import PageTitle from '@/components/pageTitle';
import React from 'react';

export const metadata = {
    title: 'Contact',
    description:
        'Contactez XTOP DIGITAL pour discuter de votre projet digital. Devis gratuit et sans engagement. Basés à Cotonou, Bénin.',
    alternates: {
        canonical: '/contact',
    },
};

const Contact = () => {
    return (
        <>
            <PageTitle title="Contactez-nous" currentPage="Contact" />
            <ContactInfo />
            <GoogleMap />
        </>
    );
};

export default Contact;
