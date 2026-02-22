import { Kanit, Poppins } from "next/font/google";
import "@/assets/font/bootstrap-font/bootstrap-icons.min.css";
import "@/assets/font/font-awsome/css-js/all.min.css";
import "@/assets/font/font-awsome/css-js/all.min.js";
import "@/assets/scss/main.scss";
import "@/styles/testimonial.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer";
import PathNameLoad from "@/utils/pathNameLoad";
import Bootstrap from "@/components/Bootstrap";
import NextAuthSessionProvider from "@/providers/SessionProvider";
import WhatsAppButton from "@/components/whatsappButton";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-kanit",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xtopdigital.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "XTOP DIGITAL | Agence Digitale à Cotonou, Bénin",
    template: "%s | XTOP DIGITAL",
  },
  description:
    "Agence digitale au Bénin spécialisée en création de sites web, applications sur mesure, SEO, marketing digital et design UI/UX. Transformez vos idées en solutions digitales performantes.",
  keywords: [
    "agence digitale Cotonou",
    "création site web Bénin",
    "développement application",
    "SEO Bénin",
    "marketing digital Afrique",
    "agence web Cotonou",
    "design UI UX",
    "transformation digitale",
  ],
  authors: [{ name: "XTOP DIGITAL" }],
  creator: "XTOP DIGITAL",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "XTOP DIGITAL",
    title: "XTOP DIGITAL | Agence Digitale à Cotonou, Bénin",
    description:
      "Transformez vos idées en solutions digitales performantes. Création web, SEO, marketing digital et design UI/UX.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "XTOP DIGITAL - Agence Digitale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XTOP DIGITAL | Agence Digitale à Cotonou, Bénin",
    description:
      "Transformez vos idées en solutions digitales performantes.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "XTOP DIGITAL",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description:
      "Agence digitale au Bénin spécialisée en création de sites web, applications, SEO et marketing digital.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cotonou",
      addressCountry: "BJ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+229-01-64-22-33-28",
      contactType: "customer service",
      email: "contact@xtopdigital.com",
      availableLanguage: "French",
    },
    sameAs: [],
  };

  return (
    <html
      lang="fr"
      className={`${kanit.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Bootstrap />
        <PathNameLoad />
        <NextAuthSessionProvider>
          <Header />
          {children}
          <Footer />
          <WhatsAppButton />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
