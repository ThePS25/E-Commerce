import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";

// import { ToastContainer } from 'react-toastify';

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
        {/* <link rel="canonical" href="http://mysite.com/example" /> */}
      </Helmet>

      <Header />
      <main style={{ minHeight: "125vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "ZooPHii.com",
  description: "MERN Stack Project",
  keywords: "mern,react,node,mongodb",
  author: "Pratyush",
};
export default Layout;
