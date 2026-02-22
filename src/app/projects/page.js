import PageTitle from '@/components/pageTitle';
import ProjectsThree from '@/components/projects/projectsThree';
import React from 'react';

export const metadata = {
    title: 'Nos réalisations',
    description:
        'Découvrez nos projets et réalisations : sites web, applications, solutions digitales. Portfolio de l\'agence XTOP DIGITAL à Cotonou.',
    alternates: {
        canonical: '/projects',
    },
};

const Projects = () => {
    return (
        <>
            <PageTitle title="Nos réalisations" currentPage="Nos réalisations" />
            <ProjectsThree />
        </>
    );
};

export default Projects;
