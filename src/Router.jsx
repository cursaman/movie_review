import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

export default function Router() {
  return <HashRouter><Routes><Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<Movie />} />
    <Route path="/search" element={<Search />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes></HashRouter>;
}
