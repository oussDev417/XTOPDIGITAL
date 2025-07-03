import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Service from '@/models/Service';
import Project from '@/models/Project';
import Testimonial from '@/models/Testimonial';

// Fonctions pour récupérer les données depuis la base de données pour le frontend

export async function getBlogs({ limit = 6, featured = false } = {}) {
  try {
    await connectToDatabase();
    
    const query = { published: true };
    
    if (featured) {
      query.featured = true;
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error('Erreur lors de la récupération des blogs:', error);
    // En cas d'erreur, retourner un tableau vide
    return [];
  }
}

export async function getBlogBySlug(slug) {
  try {
    await connectToDatabase();
    
    const blog = await Blog.findOne({ slug, published: true });
    
    if (!blog) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Erreur lors de la récupération du blog:', error);
    return null;
  }
}

export async function getServices({ limit = 6, featured = false } = {}) {
  try {
    await connectToDatabase();
    
    const query = { published: true };
    
    if (featured) {
      query.featured = true;
    }
    
    const services = await Service.find(query)
      .sort({ order: 1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
}

export async function getServiceBySlug(slug) {
  try {
    await connectToDatabase();
    
    const service = await Service.findOne({ slug, published: true });
    
    if (!service) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return null;
  }
}

export async function getProjects({ limit = 6, featured = false } = {}) {
  try {
    await connectToDatabase();
    
    const query = { published: true };
    
    if (featured) {
      query.featured = true;
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return [];
  }
}

export async function getProjectBySlug(slug) {
  try {
    await connectToDatabase();
    
    const project = await Project.findOne({ slug, published: true });
    
    if (!project) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return null;
  }
}

export async function getTestimonials({ limit = 6 } = {}) {
  try {
    await connectToDatabase();
    
    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(testimonials));
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    return [];
  }
}

/**
 * Données de secours à utiliser lorsque l'API n'est pas disponible
 */

const fallbackData = {
  testimonials: [
    {
      id: 1,
      name: "Jean Dupont",
      role: "CEO, Tech Solutions",
      content: "Nous avons choisi XTOP Digital pour notre transformation numérique et les résultats ont dépassé nos attentes. Une équipe professionnelle avec une expertise remarquable.",
      rating: 5,
      imgSrc: "/images/testimonials/person-1.jpg",
      published: true,
      order: 1
    },
    {
      id: 2,
      name: "Marie Lambert",
      role: "Directrice Marketing, Mode Élégance",
      content: "Notre site e-commerce a vu ses ventes augmenter de 60% après le travail exceptionnel réalisé par l'équipe de XTOP Digital. Leur approche est innovante et efficace.",
      rating: 5,
      imgSrc: "/images/testimonials/person-2.jpg",
      published: true,
      order: 2
    },
    {
      id: 3,
      name: "Thomas Martin",
      role: "Fondateur, StartupNow",
      content: "Je recommande vivement XTOP Digital pour leur professionnalisme et leur capacité à transformer une vision en réalité numérique concrète et performante.",
      rating: 4,
      imgSrc: "/images/testimonials/person-3.jpg", 
      published: true,
      order: 3
    }
  ],
  services: [
    {
      id: 1,
      title: "Développement Web",
      description: "Création de sites web performants et optimisés pour tous vos besoins d'entreprise.",
      icon: "bi bi-code-square",
      slug: "developpement-web",
      published: true,
      order: 1
    },
    {
      id: 2,
      title: "Marketing Digital",
      description: "Stratégies marketing avancées pour améliorer votre visibilité en ligne et générer des leads.",
      icon: "bi bi-graph-up-arrow",
      slug: "marketing-digital",
      published: true,
      order: 2
    },
    {
      id: 3,
      title: "E-commerce",
      description: "Solutions de commerce électronique sur mesure pour booster vos ventes en ligne.",
      icon: "bi bi-cart4",
      slug: "e-commerce",
      published: true,
      order: 3
    },
    {
      id: 4,
      title: "SEO / SEM",
      description: "Optimisation pour les moteurs de recherche pour améliorer votre classement et votre visibilité.",
      icon: "bi bi-search",
      slug: "seo-sem",
      published: true,
      order: 4
    },
    {
      id: 5,
      title: "Développement d'Applications",
      description: "Création d'applications mobiles et web personnalisées pour répondre à vos besoins spécifiques.",
      icon: "bi bi-phone",
      slug: "developpement-applications",
      published: true,
      order: 5
    },
    {
      id: 6,
      title: "Design UX/UI",
      description: "Conception d'interfaces utilisateur intuitives et esthétiques pour une expérience optimale.",
      icon: "bi bi-palette",
      slug: "design-ux-ui",
      published: true,
      order: 6
    }
  ],
  projects: [
    {
      id: 1,
      title: "Refonte E-commerce Mode",
      slug: "refonte-ecommerce-mode",
      category: "E-commerce",
      description: "Refonte complète d'une plateforme de vente en ligne dans le secteur de la mode.",
      client: "Fashion Store",
      date: "2023-05-15",
      imgSrc: "/images/portfolio/project-1.jpg",
      published: true,
      featured: true,
      order: 1
    },
    {
      id: 2,
      title: "Application Mobile Banking",
      slug: "application-mobile-banking",
      category: "Développement Mobile",
      description: "Développement d'une application bancaire sécurisée avec interface utilisateur intuitive.",
      client: "Finance Plus",
      date: "2023-03-10",
      imgSrc: "/images/portfolio/project-2.jpg",
      published: true,
      featured: true,
      order: 2
    },
    {
      id: 3,
      title: "Plateforme Éducative",
      slug: "plateforme-educative",
      category: "Web",
      description: "Création d'une plateforme d'apprentissage en ligne pour une institution éducative.",
      client: "EduLearn",
      date: "2023-01-20",
      imgSrc: "/images/portfolio/project-3.jpg",
      published: true,
      featured: true,
      order: 3
    }
  ]
};

/**
 * Récupère les données de secours pour un type spécifique
 * @param {string} type - Le type de données à récupérer (testimonials, services, projects)
 * @returns {Array} Les données de secours
 */
export function getFallbackData(type) {
  return fallbackData[type] || [];
} 