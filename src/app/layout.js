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

export const metadata = {
  title: "XTOP DIGITAL",
  description: "XTOP DIGITAL Creative Digital Agency next.js templet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Bootstrap />
        <PathNameLoad />
        <NextAuthSessionProvider>
          <Header />
          {children}
          <Footer />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
