import SlideUp from '@/utils/animations/slideUp'
import Link from 'next/link'
import React from 'react'
import { formatDate } from '@/utils/formatDate'

const BlogArticle = ({ blog }) => {
    if (!blog) return null;

    const { 
        title, 
        author, 
        comments, 
        imgSrc, 
        content, 
        categories, 
        createdAt 
    } = blog;

    const formattedDate = formatDate(createdAt);

    return (
        <article>
            <img src={imgSrc} alt={title} className="w-100 thumb__img" />
            <div className="first__para">
                <ul className="d-flex flex-wrap gap-4">
                    <li>
                        <img src="/icons/user-black.svg" alt="img" />
                        <span>{author}</span>
                    </li>
                    <li>
                        <img src="/icons/comments-black.svg" alt="img" />
                        <span>{comments || 0} Comments</span>
                    </li>
                    <li>
                        <img src="/icons/clender.svg" alt="img" />
                        <span>{formattedDate}</span>
                    </li>
                </ul>
                <SlideUp>
                    <h2 className="t__54">
                        {title}
                    </h2>
                </SlideUp>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            <SlideUp className="d-flex justify-content-between flex-wrap align-items-center share__option">
                <div className="d-flex align-items-center gap-4">
                    <h6>Catégories:</h6>
                    {categories && categories.map((category, index) => (
                        <Link key={index} href={`/blog?category=${category}`}>
                            <button className={index === 0 ? "active" : ""}>{category}</button>
                        </Link>
                    ))}
                </div>
                <div className="d-flex align-items-center gap-4 mt-3 mt-sm-0">
                    <h6>Partager:</h6>
                    <ul className="d-flex justify-content-center gap-3">
                        <li>
                            <Link href="#">
                                <i className="fa-brands fa-facebook-f" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <i className="fa-brands fa-pinterest-p" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <i className="fa-brands fa-instagram" />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <i className="fa-brands fa-twitter" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </SlideUp>
        </article>
    )
}

export default BlogArticle