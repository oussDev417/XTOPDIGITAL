'use client';

import SlideUp from '@/utils/animations/slideUp';
import SlideDown from '@/utils/animations/slideDown';

const steps = [
    {
        number: '01',
        title: 'Échange & Diagnostic',
        description: 'Nous analysons vos besoins, vos objectifs et votre marché pour définir une stratégie digitale claire et adaptée.',
        icon: 'fa-comments',
    },
    {
        number: '02',
        title: 'Conception & Design',
        description: 'Notre équipe conçoit des maquettes modernes et une architecture technique pensée pour la performance.',
        icon: 'fa-pen-ruler',
    },
    {
        number: '03',
        title: 'Développement & Tests',
        description: 'Nous développons votre solution avec les technologies les plus adaptées et testons rigoureusement chaque fonctionnalité.',
        icon: 'fa-code',
    },
    {
        number: '04',
        title: 'Lancement & Suivi',
        description: 'Mise en ligne, formation et accompagnement continu pour garantir le succès de votre projet sur le long terme.',
        icon: 'fa-rocket',
    },
];

const ProcessSection = () => {
    return (
        <section className="process-section py__130">
            <div className="container">
                <SlideDown className="text-center process-section__header">
                    <span className="section-label">Notre méthode</span>
                    <h2 className="t__54">
                        Un processus simple et éprouvé
                    </h2>
                    <p className="process-section__subtitle">
                        De l&apos;idée au lancement, nous vous accompagnons à chaque étape
                    </p>
                </SlideDown>

                <div className="row mt-5">
                    {steps.map((step, index) => (
                        <div className="col-lg-3 col-md-6 mb-4" key={step.number}>
                            <SlideUp delay={index + 1}>
                                <div className="process-card">
                                    <div className="process-card__number">{step.number}</div>
                                    <div className="process-card__icon">
                                        <i className={`fa-solid ${step.icon}`}></i>
                                    </div>
                                    <h3 className="process-card__title">{step.title}</h3>
                                    <p className="process-card__text">{step.description}</p>
                                    {index < steps.length - 1 && (
                                        <div className="process-card__connector d-none d-lg-block">
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </div>
                                    )}
                                </div>
                            </SlideUp>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
