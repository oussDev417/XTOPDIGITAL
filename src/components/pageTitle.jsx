import SlideUp from '@/utils/animations/slideUp';
import Link from 'next/link';
import React from 'react';

const PageTitle = ({ title, currentPage }) => {
    return (
        <section className="page__header position-relative">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-xl-between justify-content-center align-items-center">
                        <img src="/images/pageHeader/Group_78_3.svg" alt="" role="presentation" className="img-fluid left__pei" />
                        <img src="/images/pageHeader/Group727.svg" alt="" role="presentation" className="left__arrow img-fluid" />
                        <SlideUp className="text-center">
                            <h1 className="page__header_title">{title}</h1>
                            <nav aria-label="Fil d'Ariane" className="d-flex justify-content-center gap-2">
                                <Link href="/">Accueil</Link>
                                <span>/</span>
                                <span aria-current="page">{currentPage}</span>
                            </nav>
                        </SlideUp>
                        <img src="/images/pageHeader/Group726.png" alt="" role="presentation" className="img-fluid right__arrow" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageTitle;
