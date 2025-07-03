import SlideUp from '@/utils/animations/slideUp'
import Link from 'next/link'
import React from 'react'

const ProjectsUseCase = () => {
    return (
        <SlideUp className="projects__usecase">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="projects__usecase_content">
                        <h3 className="t__54">
                            Des solutions sur mesure pour votre entreprise
                        </h3>
                        <p className="pt__50">
                            Chez XTOP, nous créons des solutions sur mesure pour répondre à vos besoins spécifiques. Que vous ayez besoin d'un site web, d'une application mobile, d'un chatbot intelligent ou d'un système métier sur mesure, nous vous accompagnons pour transformer vos idées en réalité.
                        </p>
                        <Link href={"/contact"} className="common__btn">
                            <span>Démarrer maintenant</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 mt-5 mt-lg-0">
                    <div>
                        <img src="/images/projects/site.jpg" alt="img" className="projects__usecase_img" />
                    </div>
                </div>
            </div>
        </SlideUp>
    )
}

export default ProjectsUseCase