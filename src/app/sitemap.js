const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xtopdigital.com";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let dynamicRoutes = [];

  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const [blogsRes, servicesRes, projectsRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/blogs?limit=100`),
      fetch(`${baseUrl}/api/services?limit=100`),
      fetch(`${baseUrl}/api/projects?limit=100`),
    ]);

    if (blogsRes.status === "fulfilled" && blogsRes.value.ok) {
      const data = await blogsRes.value.json();
      const blogs = data.blogs || [];
      dynamicRoutes.push(
        ...blogs.map((blog) => ({
          url: `${siteUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt),
          changeFrequency: "weekly",
          priority: 0.6,
        }))
      );
    }

    if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
      const data = await servicesRes.value.json();
      const services = data.services || [];
      dynamicRoutes.push(
        ...services.map((service) => ({
          url: `${siteUrl}/service-details/${service.slug}`,
          lastModified: new Date(service.updatedAt || service.createdAt),
          changeFrequency: "monthly",
          priority: 0.7,
        }))
      );
    }

    if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
      const data = await projectsRes.value.json();
      const projects = data.projects || [];
      dynamicRoutes.push(
        ...projects.map((project) => ({
          url: `${siteUrl}/project-details/${project.slug}`,
          lastModified: new Date(project.updatedAt || project.createdAt),
          changeFrequency: "monthly",
          priority: 0.6,
        }))
      );
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
