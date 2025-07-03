import Link from 'next/link'
import React from 'react'

const ServiceCard = ({ imgSrc, title, description, className, slug }) => {
    return (
        <div className={`service__card services__2_card ${className || ''}`}>
            <img src={imgSrc} alt={title} />
            <h3 className="t__28">{title}</h3>
            <p>{description}</p>
            <Link href={`/service-details/${slug}`} className="d-flex align-items-center">
                <span>Voir plus de détails</span>
                <i className="fa-solid fa-arrow-right"></i>
            </Link>
        </div>
    )
}

export default ServiceCard