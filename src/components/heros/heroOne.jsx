import SlideUp from '@/utils/animations/slideUp'
import Link from 'next/link'
import React from 'react'

const HeroOne = () => {
  return (
    <section className="banner overflow-hidden">
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-8">
            <div className="banner__content">
              <div className="banner__content_title">
                <SlideUp>
                  <h1>Innovation et Expertise en création de site web</h1>
                </SlideUp>
                <SlideUp delay={2}>
                  <p>
                    Chez XTOP, nous transformons vos idées en réalité avec des sites web, 
                    applications mobiles et solutions IA innovantes. Boostez votre entreprise 
                    avec notre expertise technique et créative.
                  </p>
                </SlideUp>
                <SlideUp delay={3}>
                  <h2 className='text-white'>XTOP DIGITAL</h2>
                </SlideUp>
              </div>
              <SlideUp delay={4} className="buttons d-sm-flex align-items-center">
                <Link href={"/services"} className="common__btn buttons_file">
                  <span>Nos Services</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link href={"/about"} className="common__btn buttons_outline mt-4 mt-sm-0">
                  <span>En savoir plus</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </SlideUp>
              <SlideUp delay={5} className="banner__content_number d-flex justify-content-between" >
                <div>
                  <h4>5+</h4>
                  <p>Ans d'expérience</p>
                </div>
                <div>
                  <h4>100%</h4>
                  <p>Taux de satisfaction</p>
                </div>
                <div>
                  <h4>10+</h4>
                  <p>Projets réalisés</p>
                </div>
              </SlideUp>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="banner__right">
              <img src="/images/banner/Shape.svg" alt="img" className="bg__shap" />
              <img src="/images/banner/Video.svg" alt="img" className="bg__video" />
              <div>
                <img src="/images/banner/Rectangle96.png" alt="img" className="bg__img" />
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 h-100 w-100">
          <div className="banner__shap_1 banner__shap" />
          <div className="banner__shap_2 banner__shap" />
          <div className="banner__shap_3 banner__shap" />
          <div className="banner__shap_4 banner__shap" />
        </div>
      </div>
    </section>

  )
}

export default HeroOne