'use client';

import BlogArticle from '@/components/blogs/blogArticle';
import BlogSidebar from '@/components/blogs/blogSidebar';
import Comments from '@/components/blogs/comments';
import LeaveReply from '@/components/blogs/leaveReply';
import PageTitle from '@/components/pageTitle';
import { useState, useEffect } from 'react';

export default function BlogDetails({ params }) {
  const { slug } = params;
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blogs/${slug}`);
        
        if (!response.ok) {
          throw new Error('Blog non trouvé');
        }
        
        const data = await response.json();
        setBlog(data.blog);
      } catch (err) {
        console.error('Erreur lors du chargement du blog:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Chargement..." currentPage="Blog" />
        <section className="blog__details py__130">
          <div className="container">
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <PageTitle title="Erreur" currentPage="Blog" />
        <section className="blog__details py__130">
          <div className="container">
            <div className="alert alert-danger">
              {error || 'Blog non trouvé'}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageTitle title={blog.title} currentPage="Blog" />
      <section className="blog__details py__130">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogArticle blog={blog} />
              <Comments blogId={blog._id} />
              <LeaveReply blogId={blog._id} />
            </div>
            <div className="col-lg-4 mt-5 mt-lg-0">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 