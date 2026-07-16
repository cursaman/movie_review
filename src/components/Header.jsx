import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema } from "../schema/authSchema";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(searchSchema) });

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 30); fn(); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);
  function onSearch({ keyword }) { navigate(`/search?query=${encodeURIComponent(keyword.trim())}`); reset(); }

  return <header className={`header ${scrolled ? "header--scrolled" : ""}`}><div className="header__inner">
    <Link className="logo" to="/"><span className="logo__mark">M</span><span>무비로그</span></Link>
    <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}><span/><span/><span/></button>
    <div className={`header__panel ${menuOpen ? "is-open" : ""}`}>
      <nav className="nav"><NavLink to="/">홈</NavLink><NavLink to="/search">영화 검색</NavLink></nav>
      <form className="header-search" onSubmit={handleSubmit(onSearch)}><input type="search" placeholder="영화 제목 검색" {...register("keyword")} /><button>검색</button></form>
      <div className="auth-menu">{user ? <><span>{user.name}님</span><button type="button" onClick={() => { logout(); navigate("/"); }}>로그아웃</button></> : <><Link to="/login">로그인</Link><Link className="auth-menu__signup" to="/signup">회원가입</Link></>}</div>
    </div>
  </div></header>;
}
