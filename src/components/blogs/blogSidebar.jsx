'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const BlogSidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Tags prédéfinis (à modifier plus tard si nécessaire)
    const tags = ["Design", "Marketing", "Creative", "IT", "Business", "Développement"];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
                // Catégories par défaut en cas d'erreur
                setCategories([
                    { name: "Développement Web", count: 9 },
                    { name: "UI Design", count: 12 },
                    { name: "Graphisme", count: 6 },
                    { name: "Business", count: 9 }
                ]);
            }
        };

        const fetchLatestBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/blogs?limit=3');
                if (response.ok) {
                    const data = await response.json();
                    setLatestBlogs(data.blogs || []);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des blogs récents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
        fetchLatestBlogs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <aside className="sidebar">
            <div className="search__box">
                <label htmlFor="search" className="t__22">Recherche</label>
                <form onSubmit={handleSearch} className="position-relative">
                    <input 
                        id="search" 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="border-0 bg-transparent">
                        <i className="fa-solid fa-magnifying-glass" />
                    </button>
                </form>
            </div>
            {/* -- Categories */}
            <div className="categories pt__60">
                <h5 className="t__22">Catégories</h5>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <Link href={`/blog?category=${encodeURIComponent(category.name)}`}>
                                {category.name}
                            </Link>
                            <p>({category.count})</p>
                        </li>
                    ))}
                </ul>
            </div>
            {/* -- latest post */}
            <div className="latest__post pt__60">
                <h5 className="t__22">Articles Récents</h5>
                {isLoading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <ul>
                        {latestBlogs.map((blog) => (
                            <li key={blog._id}>
                                <Link href={`/blog/${blog.slug}`}>
                                    <img src={blog.imgSrc} alt={blog.title} className="thumb__img" />
                                </Link>
                                <div>
                                    <Link href={`/blog/${blog.slug}`}>
                                        {blog.title}
                                    </Link>
                                    <p>
                                        <img src="/icons/clender.svg" alt="date" />
                                        <span>{new Date(blog.createdAt).toLocaleDateString('fr-FR')}</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* -- Tags */}
            <div className="tags pt__60">
                <h5 className="t__22">Tags:</h5>
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index}>
                            <Link 
                                href={`/blog?search=${encodeURIComponent(tag)}`} 
                                className={searchParams.get('search') === tag ? "active" : ""}
                            >
                                {tag}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

export default BlogSidebar