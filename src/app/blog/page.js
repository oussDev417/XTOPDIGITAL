import PageTitle from '@/components/pageTitle';
import BlogPageContent from '@/components/blogs/blogPageContent';

export const metadata = {
    title: 'Blog',
    description:
        'Conseils, tendances et actualités du digital. Découvrez nos articles sur le développement web, le SEO, le marketing digital et plus encore.',
    alternates: {
        canonical: '/blog',
    },
};

export default function Blog() {
    return (
        <>
            <PageTitle title="Notre Blog" currentPage="Blog" />
            <BlogPageContent />
        </>
    );
}
