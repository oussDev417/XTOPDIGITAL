'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SlideDown from '@/utils/animations/slideDown';
import SlideUp from '@/utils/animations/slideUp';
import { getFallbackData } from '@/utils/data-fetchers';
import BlogCard from './blogCard';

export default function HomeBlog({ className }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?limit=3');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des blogs');
        }
        
        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error('Erreur:', error);
        // Utiliser les données statiques comme fallback en cas d'erreur
        const fallbackBlogs = getFallbackData('blogs');
        setBlogs(fallbackBlogs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <section className={`blogs ${className}`}>
        <div className="container">
          <SlideDown className="blogs__title">
            <h1 className="title text-center">
              Découvrez nos dernières actualités et articles de blog
            </h1>
          </SlideDown>
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`blogs ${className}`}>
      <div className="container">
        <SlideDown className="blogs__title">
          <h1 className="title text-center">
            Découvrez nos dernières actualités et articles de blog
          </h1>
        </SlideDown>
        <div className="blogs__wapper">
          <div className="row">
            {blogs.map((blog) => (
              <SlideUp
                key={blog._id || blog.id}
                className="col-lg-4 col-md-6 mb-lg-0 mb-5"
                delay={1}
              >
                <BlogCard 
                  author={blog.author} 
                  comments={blog.comments} 
                  imgSrc={blog.imgSrc} 
                  title={blog.title}
                  slug={blog.slug}
                />
              </SlideUp>
            ))}
          </div>
        </div>
        <div className="blog-all-btn mt-70 text-center">
          <Link href="/blog" className="btn">
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}