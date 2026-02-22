'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
    return (
        <section className="not-found-page">
            <div className="container">
                <div className="not-found-page__content">
                    <span className="not-found-page__code">Erreur</span>
                    <h1 className="not-found-page__title">
                        Quelque chose s&apos;est mal passé
                    </h1>
                    <p className="not-found-page__text">
                        Une erreur inattendue est survenue. Veuillez réessayer
                        ou revenir à la page d&apos;accueil.
                    </p>
                    <div className="not-found-page__actions">
                        <button onClick={() => reset()} className="common__btn">
                            <span>Réessayer</span>
                            <i className="fa-solid fa-rotate-right"></i>
                        </button>
                        <Link href="/" className="common__btn common__btn--outline">
                            <span>Retour à l&apos;accueil</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
