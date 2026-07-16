import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollTopButton from "./ScrollTopButton";

export default function Layout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, search]);

  return (
    <div className="site-wrap">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  );
}
