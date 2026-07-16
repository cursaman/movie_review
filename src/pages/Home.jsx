import { useEffect, useState } from "react";
import {
  getImageUrl,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "../api/tmdb";
import ErrorBox from "../components/ErrorBox";
import Loading from "../components/Loading";
import MovieSection from "../components/MovieSection";
import { Link } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState({
    nowPlaying: [],
    popular: [],
    topRated: [],
  });
  const [status, setStatus] = useState({
    loading: true,
    error: "",
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setStatus({ loading: true, error: "" });

      try {
        const [nowPlaying, popular, topRated] = await Promise.all([
          getNowPlayingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

        if (!active) return;

        setData({
          nowPlaying: nowPlaying.results.slice(0, 10),
          popular: popular.results.slice(0, 10),
          topRated: topRated.results.slice(0, 10),
        });
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (!active) return;
        setStatus({ loading: false, error: error.message });
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (status.loading) {
    return <Loading />;
  }

  if (status.error) {
    return (
      <ErrorBox
        message={status.error}
        onRetry={() => setReloadKey((value) => value + 1)}
      />
    );
  }

  const featured = data.nowPlaying.find((movie) => movie.backdrop_path);
  const backdrop = featured
    ? getImageUrl(featured.backdrop_path, "original")
    : "";

  return (
    <>
      <title>무비로그 | 현재 상영작과 인기 영화</title>
      <meta
        name="description"
        content="현재 상영작, 인기 영화, 평점 높은 영화를 한눈에 확인하세요."
      />

      <section
        className="hero"
        style={
          backdrop
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(5,7,12,.96) 0%, rgba(5,7,12,.68) 52%, rgba(5,7,12,.25) 100%), url(${backdrop})`,
              }
            : undefined
        }
      >
        <div className="container hero__content">
          <span className="eyebrow">NOW PLAYING</span>
          <h1>{featured?.title || "오늘, 어떤 영화를 만나볼까요?"}</h1>
          <p>
            {featured?.overview ||
              "현재 상영 중인 영화부터 인기 작품과 평점 높은 영화까지 만나보세요."}
          </p>
          <div className="hero__buttons">
            {featured && (
              <Link className="button button--primary" to={`/movie/${featured.id}`}>
                상세 정보
              </Link>
            )}
            <Link className="button button--glass" to="/search">
              영화 검색
            </Link>
          </div>
        </div>
      </section>

      <MovieSection
        eyebrow="NOW PLAYING"
        title="현재 상영 중"
        movies={data.nowPlaying}
      />
      <MovieSection
        eyebrow="POPULAR"
        title="지금 인기 있는 영화"
        movies={data.popular}
      />
      <MovieSection
        eyebrow="TOP RATED"
        title="평점 높은 영화"
        movies={data.topRated}
      />
    </>
  );
}
