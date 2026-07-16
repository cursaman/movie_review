import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import { searchSchema } from "../schema/authSchema";
import ErrorBox from "../components/ErrorBox";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || ""; const page = Number(searchParams.get("page") || 1);
  const [result, setResult] = useState({ movies: [], totalPages: 0, totalResults: 0 });
  const [status, setStatus] = useState({ loading: false, error: "" });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(searchSchema), defaultValues: { keyword: query } });
  useEffect(() => reset({ keyword: query }), [query, reset]);
  useEffect(() => { let active = true; async function run() { if (!query) { setResult({ movies: [], totalPages: 0, totalResults: 0 }); return; } setStatus({ loading: true, error: "" }); try { const data = await searchMovies(query, page); if (active) { setResult({ movies: data.results, totalPages: Math.min(data.total_pages, 500), totalResults: data.total_results }); setStatus({ loading: false, error: "" }); } } catch (e) { if (active) setStatus({ loading: false, error: e.message }); } } run(); return () => { active = false; }; }, [query, page]);
  function onSubmit({ keyword }) { setSearchParams({ query: keyword.trim(), page: "1" }); }
  function movePage(next) { setSearchParams({ query, page: String(next) }); }

  return <><title>{query ? `${query} 검색 결과` : "영화 검색"} | 무비로그</title><section className="page-hero"><div className="container"><span className="eyebrow">SEARCH</span><h1>영화 검색</h1><p>React Hook Form과 Zod로 검색어를 검사합니다.</p><form className="page-search" onSubmit={handleSubmit(onSubmit)} noValidate><input type="search" placeholder="예: 기생충, 듄" {...register("keyword")} /><button className="button button--primary">검색</button></form>{errors.keyword && <p className="form-error page-search-error">{errors.keyword.message}</p>}</div></section><section className="search-results"><div className="container">
    {status.loading && <Loading message="검색 결과를 불러오는 중입니다." />}{status.error && <ErrorBox message={status.error} />}
    {!status.loading && !status.error && !query && <div className="state-box"><strong>검색어를 입력해 주세요.</strong><p>영화 제목의 일부만 입력해도 됩니다.</p></div>}
    {!status.loading && !status.error && query && result.movies.length === 0 && <div className="state-box"><strong>검색 결과가 없습니다.</strong></div>}
    {!status.loading && !status.error && result.movies.length > 0 && <><div className="search-summary"><h2>“{query}” 검색 결과</h2><p>총 {result.totalResults.toLocaleString("ko-KR")}개</p></div><div className="movie-grid">{result.movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}</div><div className="pagination"><button disabled={page <= 1} onClick={() => movePage(page - 1)}>이전</button><span>{page} / {result.totalPages}</span><button disabled={page >= result.totalPages} onClick={() => movePage(page + 1)}>다음</button></div></>}
  </div></section></>;
}
