import Link from 'next/link'
import React from 'react'

const ServiceCard = ({ imgSrc, title, description, className, slug }) => {
    return (
        <>
            <style jsx>{`
                .service__card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    object-position: center;
                    border-radius: 8px;
                    transition: transform 0.3s ease;
                }
                .service__card:hover img {
                    transform: scale(1.05);
                }
                .service__card {
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .service__card h3 {
                    flex-shrink: 0;
                }
                .service__card p {
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .service__card a {
                    flex-shrink: 0;
                    margin-top: auto;
                }
            `}</style>
            <div className={`service__card services__2_card ${className || ''}`}>
                <img src={imgSrc} alt={title} />
                <h3 className="t__28">{title}</h3>
                <p>{description}</p>
                <Link href={`/service-details/${slug}`} className="d-flex align-items-center">
                    <span>Voir plus de détails</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </>
    )
}

export default ServiceCard