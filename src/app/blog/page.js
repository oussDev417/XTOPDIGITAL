'use client';

import BlogCard from '@/components/blogs/blogCard'
import BlogSidebar from '@/components/blogs/blogSidebar'
import PageTitle from '@/components/pageTitle'
import SlideDown from '@/utils/animations/slideDown'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function BlogContent() {
    const searchParams = useSearchParams()
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const [blogs, setBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true)
                
                let url = `/api/blogs?page=${currentPage}&limit=6`
                if (category) {
                    url += `&category=${encodeURIComponent(category)}`
                }
                if (search) {
                    url += `&search=${encodeURIComponent(search)}`
                }
                
                const response = await fetch(url)
                
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des blogs')
                }
                
                const data = await response.json()
                
                setBlogs(data.blogs || [])
                setTotalPages(data.totalPages || 1)
            } catch (err) {
                console.error('Erreur:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlogs()
    }, [currentPage, category, search])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <section className="all__blog py__130">
            <div className="container">
                {error && (
                    <div className="alert alert-danger mb-4">{error}</div>
                )}
                
                {category && (
                    <div className="mb-4">
                        <h2 className="t__28">Catégorie: {category}</h2>
                        <hr />
                    </div>
                )}
                
                {search && (
                    <div className="mb-4">
                        <h2 className="t__28">Recherche: {search}</h2>
                        <hr />
                    </div>
                )}
                
                <div className="row">
                    <div className="col-lg-8">
                        {isLoading ? (
                            <div className="flex justify-center my-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : blogs.length > 0 ? (
                            <>
                                <div className="row">
                                    {blogs.map((blog) => (
                                        <SlideDown
                                            key={blog._id}
                                            className="col-md-6 mb-4"
                                            delay={1}
                                        >
                                            <BlogCard 
                                                author={blog.author} 
                                                comments={blog.comments} 
                                                imgSrc={blog.imgSrc} 
                                                title={blog.title}
                                                slug={blog.slug}
                                            />
                                        </SlideDown>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination mt-5 d-flex justify-content-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`pagination-item ${currentPage === i + 1 ? 'active' : ''}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-info">Aucun blog trouvé.</div>
                        )}
                    </div>
                    <div className="col-lg-4 mt-5 mt-lg-0">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function Blog() {
    return (
        <>
            <PageTitle title={"Blog"} currentPage={"Blog"} />
            <Suspense fallback={<div>Chargement...</div>}>
                <BlogContent />
            </Suspense>
        </>
    )
}