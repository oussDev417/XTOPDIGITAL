'use client';

import { useEffect, useState } from 'react';
import { projectsTwoData } from '@/db/projectsTwoData';
import ProjectCard from './projectCard';
import SlideUp from '@/utils/animations/slideUp';

export default function ProjectsThree() {
    const [projects, setProjects] = useState(projectsTwoData);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) return;
                const data = await res.json();
                if (data.projects && data.projects.length > 0) {
                    setProjects(
                        data.projects.map((p, idx) => ({
                            id: idx,
                            title: p.title,
                            imgSrc: p.imgSrc,
                            categories: p.category.split(',').map(s=>s.trim()),
                            slug: p.slug
                        }))
                    );
                }
            } catch (e) { console.error(e); }
        }
        fetchProjects();
    }, []);

    return (
        <section className="all__project py__130">
            <div className="container">
                <div className="row">
                    <div className="row">
                        {projects.map(({ categories, id, imgSrc, title, slug }) => (
                            <SlideUp
                                key={id}
                                className={`col-xl-4 col-md-6 mb-5 mb-xl-0`}
                                delay={id}
                            >
                                <ProjectCard categories={categories} imgSrc={imgSrc} title={title} slug={slug} />
                            </SlideUp>
                        ))}
                    </div>
                </div>
                <SlideUp className="custom__pagination">
                    <div className="row">
                        <div className="col-12">
                            <ul className="d-flex justify-content-center">
                                <li>
                                    <i className="fa-solid fa-arrow-left" />
                                </li>
                                <li>01</li>
                                <li>02</li>
                                <li>03</li>
                                <li>
                                    <i className="fa-solid fa-arrow-right" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </section>
    );
}