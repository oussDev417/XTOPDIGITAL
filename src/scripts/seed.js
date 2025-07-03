const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Veuillez définir la variable d\'environnement MONGODB_URI');
  process.exit(1);
}

// Modèle User
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom'],
    },
    email: {
      type: String,
      required: [true, 'Veuillez fournir un email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir un email valide',
      ],
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'editor',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Modèle Blog
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Veuillez fournir un titre'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu'],
    },
    excerpt: {
      type: String,
      required: [true, 'Veuillez fournir un extrait'],
      maxlength: [200, 'L\'extrait ne peut pas dépasser 200 caractères'],
    },
    author: {
      type: String,
      required: [true, 'Veuillez fournir un auteur'],
    },
    categories: {
      type: [String],
      default: ['Non catégorisé'],
    },
    comments: {
      type: Number,
      default: 0,
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// Modèle Service
const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Veuillez fournir un titre'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Veuillez fournir une description'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu détaillé'],
    },
    icon: {
      type: String,
      required: [true, 'Veuillez fournir une icône'],
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// Modèle Project
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Veuillez fournir un titre'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Veuillez fournir une catégorie'],
    },
    description: {
      type: String,
      required: [true, 'Veuillez fournir une description'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu détaillé'],
    },
    client: {
      type: String,
      required: [true, 'Veuillez fournir un nom de client'],
    },
    date: {
      type: Date,
      required: [true, 'Veuillez fournir une date'],
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image principale'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Modèle Testimonial
const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Veuillez fournir un rôle ou une entreprise'],
    },
    content: {
      type: String,
      required: [true, 'Veuillez fournir un contenu'],
      maxlength: [500, 'Le contenu ne peut pas dépasser 500 caractères'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    imgSrc: {
      type: String,
      required: [true, 'Veuillez fournir une image'],
    },
    published: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

// Données initiales
const blogOneData = [
  {
    id: 1,
    title: 'Change your life to a get 09 thing with the lifestyle',
    author: 'Danuel Stone',
    comments: 34,
    imgSrc: '/images/blogs/blog-1.png',
  },
  {
    id: 2,
    title: 'How to increase your business policy for next generation',
    author: 'William Dalton',
    comments: 34,
    imgSrc: '/images/blogs/blog-2.png',
  },
  {
    id: 3,
    title: 'How to increase in-app purchase why lead generation is key for',
    author: 'Sojol Saiful',
    comments: 3,
    imgSrc: '/images/blogs/blog-3.png',
  }
];

const servicesOneData = [
  {
    title: 'Web Development',
    description: 'We build professional responsive websites optimized for the most popular search engines.',
    icon: 'bi bi-code-slash',
  },
  {
    title: 'Digital Marketing',
    description: 'We offer digital marketing services to help you grow your business and reach your target audience.',
    icon: 'bi bi-graph-up-arrow',
  },
  {
    title: 'Brand Identity',
    description: 'We create memorable brand identities that help you stand out from the competition.',
    icon: 'bi bi-palette',
  },
  {
    title: 'Social Media Management',
    description: 'We manage your social media presence to help you connect with your audience.',
    icon: 'bi bi-share',
  }
];

const projectsOneData = [
  {
    title: 'Website Design for Tech Startup',
    category: 'Web Design',
    imgSrc: '/images/projects/project-1.png',
  },
  {
    title: 'Branding for Financial Company',
    category: 'Branding',
    imgSrc: '/images/projects/project-2.png',
  },
  {
    title: 'E-commerce Development for Retail Store',
    category: 'Development',
    imgSrc: '/images/projects/project-3.png',
  }
];

const testimonialsOneData = [
  {
    name: 'Robert Johnson',
    designation: 'CEO, Tech Solutions',
    review: 'Working with this team was an excellent experience. They delivered our project on time and exceeded our expectations.',
    imgSrc: '/images/testimonials/user-1.png',
  },
  {
    name: 'Sarah Williams',
    designation: 'Marketing Director',
    review: 'Our digital marketing campaign saw a 300% increase in ROI after implementing their strategies. Highly recommended!',
    imgSrc: '/images/testimonials/user-2.png',
  },
  {
    name: 'Michael Davis',
    designation: 'Small Business Owner',
    review: 'The new website design has completely transformed our business. We\'ve seen a significant increase in customer engagement.',
    imgSrc: '/images/testimonials/user-3.png',
  }
];

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à la base de données réussie');

    // Création de l'utilisateur administrateur
    const adminExists = await User.findOne({ email: 'admin@digiv.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin',
        email: 'admin@digiv.com',
        password: hashedPassword,
        role: 'admin',
      });
      
      console.log('Utilisateur administrateur créé avec succès');
    } else {
      console.log('Utilisateur administrateur existe déjà');
    }

    // Importation des blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const blogs = blogOneData.map(blog => ({
        title: blog.title,
        slug: createSlug(blog.title),
        excerpt: blog.title,
        content: `Contenu détaillé pour ${blog.title}`,
        author: blog.author,
        comments: blog.comments,
        imgSrc: blog.imgSrc,
        published: true,
      }));
      
      await Blog.insertMany(blogs);
      console.log(`${blogs.length} blogs importés avec succès`);
    } else {
      console.log('Les blogs existent déjà dans la base de données');
    }

    // Importation des services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const services = servicesOneData.map((service, index) => ({
        title: service.title,
        slug: createSlug(service.title),
        description: service.description || 'Description du service',
        content: `Contenu détaillé pour ${service.title}`,
        icon: service.icon || 'bi bi-gear',
        imgSrc: '/images/services/service-1.png',
        published: true,
        order: index,
      }));
      
      await Service.insertMany(services);
      console.log(`${services.length} services importés avec succès`);
    } else {
      console.log('Les services existent déjà dans la base de données');
    }

    // Importation des projets
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projects = projectsOneData.map((project, index) => ({
        title: project.title,
        slug: createSlug(project.title),
        category: project.category || 'Web Design',
        description: 'Description du projet',
        content: `Contenu détaillé pour ${project.title}`,
        client: 'Client Example',
        date: new Date(),
        imgSrc: project.imgSrc || '/images/projects/project-1.png',
        gallery: [],
        technologies: ['HTML', 'CSS', 'JavaScript'],
        published: true,
        featured: index < 3,
      }));
      
      await Project.insertMany(projects);
      console.log(`${projects.length} projets importés avec succès`);
    } else {
      console.log('Les projets existent déjà dans la base de données');
    }

    // Importation des témoignages
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const testimonials = testimonialsOneData.map((testimonial, index) => ({
        name: testimonial.name,
        role: testimonial.designation,
        content: testimonial.review,
        rating: 5,
        imgSrc: testimonial.imgSrc || '/images/testimonials/user-1.png',
        published: true,
        order: index,
      }));
      
      await Testimonial.insertMany(testimonials);
      console.log(`${testimonials.length} témoignages importés avec succès`);
    } else {
      console.log('Les témoignages existent déjà dans la base de données');
    }

    console.log('Initialisation de la base de données terminée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

seedDatabase(); 