import Link from 'next/link';

export const metadata = {
    title: 'Page introuvable',
    description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
};

export default function NotFound() {
    return (
        <section className="not-found-page">
            <div className="container">
                <div className="not-found-page__content">
                    <span className="not-found-page__code">404</span>
                    <h1 className="not-found-page__title">
                        Oups ! Page introuvable
                    </h1>
                    <p className="not-found-page__text">
                        La page que vous recherchez n&apos;existe pas, a été déplacée
                        ou est temporairement indisponible.
                    </p>
                    <div className="not-found-page__actions">
                        <Link href="/" className="common__btn">
                            <span>Retour à l&apos;accueil</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link href="/contact" className="common__btn common__btn--outline">
                            <span>Contactez-nous</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
