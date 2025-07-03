import PageTitle from '@/components/pageTitle';
import SlideUp from '@/utils/animations/slideUp';

async function getProject(slug) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project;
  } catch {
    return null;
  }
}

export default async function ProjectDetails({ params }) {
  const project = await getProject(params.slug);
  if (!project) {
    return (
      <section className="py-5 text-center">
        <div className="container">
          <h1>Projet introuvable</h1>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageTitle title={project.title} currentPage={project.title} />
      <article className="project__details py__130">
        <div className="container">
          <SlideUp>
            <h1 className="title title__black text-center">{project.title}</h1>
          </SlideUp>
          <SlideUp>
            <ul className="project__info">
              <li><p>Client:</p><small>{project.client}</small></li>
              <li><p>Catégorie:</p><small>{project.category}</small></li>
              <li><p>Date:</p><small>{new Date(project.date).toLocaleDateString('fr-FR')}</small></li>
            </ul>
          </SlideUp>
          <div className="first__para">
            <img src={project.imgSrc} alt={project.title} className="w-100" />
            <h4 className="t__28">Description</h4>
            <p>{project.description}</p>
            <p dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>
          {project.gallery && project.gallery.length > 0 && (
            <div className="row pt__50">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="col-md-4 mb-3">
                  <img src={img} className="w-100 rounded-3" />
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  );
} 