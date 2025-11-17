import PageTitle from '@/components/pageTitle'
import ProjectsThree from '@/components/projects/projectsThree'
import React from 'react'

const Projects = () => {
    return (
        <>
            <PageTitle title={"Nos réalisations"} currentPage={"Nos réalisations"} />
            <ProjectsThree />
        </>
    )
}

export default Projects