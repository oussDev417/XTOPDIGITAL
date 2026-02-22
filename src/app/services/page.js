import PageTitle from '@/components/pageTitle';
import ServicesPageContent from '@/components/services/servicesPageContent';

export const metadata = {
    title: 'Services',
    description:
        'Nos services digitaux : création de sites web, développement d\'applications, SEO/SEM, marketing digital, design UI/UX. Agence digitale à Cotonou, Bénin.',
    alternates: {
        canonical: '/services',
    },
};

export default function Services() {
    return (
        <>
            <PageTitle title="Nos Services" currentPage="Services" />
            <ServicesPageContent />
        </>
    );
}
