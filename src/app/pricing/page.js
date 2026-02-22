import PageTitle from '@/components/pageTitle';
import Partner from '@/components/partner';
import PricingTable from '@/components/pricing/pricingTable';

export const metadata = {
    title: 'Tarifs',
    description:
        'Découvrez nos offres et tarifs pour la création de sites web, applications et services de marketing digital. Des solutions adaptées à tous les budgets.',
    alternates: {
        canonical: '/pricing',
    },
};

async function getPricingPlans() {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pricing`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.plans || [];
}

export default async function Pricing() {
    const plans = await getPricingPlans();
    return (
        <>
            <PageTitle title="Nos tarifs" currentPage="Tarifs" />
            <section className="pricing py__130">
                <div className="container">
                    <PricingTable plans={plans} />
                    <Partner className="bg-transparent" />
                </div>
            </section>
        </>
    );
}
