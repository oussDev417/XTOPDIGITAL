'use client';

import { useEffect, useState } from 'react';
import { projectsOneData } from '@/db/projectsOneData';
import ProjectsUseCase from '../projectsUseCase';
import SlideDown from '@/utils/animations/slideDown';
import SlideUp from '@/utils/animations/slideUp';
import Link from 'next/link';

export default function ProjectsOne({ isProjectUseCaseShow }) {
  const [projects, setProjects] = useState(projectsOneData);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?limit=4');
        if (!res.ok) return;
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(
            data.projects.map((p, idx) => ({
              id: idx,
              title: p.title,
              categories: p.category,
              imgSrc: p.imgSrc,
              slug: p.slug,
            }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section className="projects py__130">
      <div className="container">
        {/* title Start */}
        <SlideDown className="d-lg-flex justify-content-between align-items-center projects__title">
          <h1 className="title">Nos dernières réalisations pour nos meilleurs clients</h1>
          <Link href="/projects" className="circle mt-5 mt-lg-0">
            <i className="fa-solid fa-arrow-right"></i>
            <span>Voir plus</span>
          </Link>
        </SlideDown>
        {/* title End */}
        <div className="projects__wapper">
          {projects.map(({ id, title, categories, imgSrc, slug }) => (
            <SlideUp delay={id} key={id} className="projects__wapper_card">
              <Link href={slug ? `/project-details/${slug}` : '/project-details'}>
                <img src={imgSrc} alt="img" />
              </Link>
              <div>
                <Link href={slug ? `/project-details/${slug}` : '/project-details'} className="prj__title t__28">
                  {title}
                </Link>
                <p className="project__group">{categories}</p>
              </div>
            </SlideUp>
          ))}
        </div>
        {isProjectUseCaseShow && <ProjectsUseCase />}
      </div>
    </section>
  );
}