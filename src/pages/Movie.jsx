import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getImageUrl, getMovieDetail } from "../api/tmdb";
import ErrorBox from "../components/ErrorBox";
import Loading from "../components/Loading";
import ReviewForm from "../components/ReviewForm";

function getTrailer(movie) {
  const videos = movie?.videos?.results || [];
  return (
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.iso_639_1 === "ko",
    ) ||
    videos.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    )
  );
}

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadMovie() {
      setStatus({ loading: true, error: "" });

      try {
        const result = await getMovieDetail(id);
        if (!active) return;
        setMovie(result);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (!active) return;
        setStatus({ loading: false, error: error.message });
      }
    }

    loadMovie();

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (status.loading) return <Loading />;
  if (status.error) {
    return (
      <ErrorBox
        message={status.error}
        onRetry={() => setReloadKey((value) => value + 1)}
      />
    );
  }

  if (!movie) return null;

  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const poster = getImageUrl(movie.poster_path, "w500");
  const trailer = getTrailer(movie);
  const director = movie.credits?.crew?.find(
    (person) => person.job === "Director",
  );
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <>
      <title>{movie.title} | 무비로그</title>
      <meta
        name="description"
        content={movie.overview || `${movie.title} 영화 상세 정보`}
      />

      <section
        className="detail-hero"
        style={
          backdrop
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(5,7,12,.55), #0b0d12 96%), url(${backdrop})`,
              }
            : undefined
        }
      >
        <div className="container detail-hero__inner">
          <div className="detail-poster">
            {poster ? (
              <img src={poster} alt={`${movie.title} 포스터`} />
            ) : (
              <div className="image-placeholder">NO IMAGE</div>
            )}
          </div>

          <div className="detail-info">
            <span className="eyebrow">MOVIE DETAIL</span>
            <h1>{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="detail-info__original">{movie.original_title}</p>
            )}

            <div className="detail-badges">
              <span>★ {Number(movie.vote_average || 0).toFixed(1)}</span>
              <span>{movie.release_date || "개봉일 미정"}</span>
              <span>{movie.runtime ? `${movie.runtime}분` : "러닝타임 미정"}</span>
            </div>

            <div className="genre-list">
              {movie.genres?.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>

            <p className="detail-info__overview">
              {movie.overview || "등록된 줄거리가 없습니다."}
            </p>

            <dl className="detail-meta">
              <div>
                <dt>감독</dt>
                <dd>{director?.name || "정보 없음"}</dd>
              </div>
              <div>
                <dt>제작사</dt>
                <dd>
                  {movie.production_companies?.map((company) => company.name).join(", ") ||
                    "정보 없음"}
                </dd>
              </div>
            </dl>

            <div className="detail-actions">
              {trailer && (
                <a
                  className="button button--primary"
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  예고편 보기
                </a>
              )}
              <Link className="button button--glass" to="/">
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container detail-content">
        {cast.length > 0 && (
          <section className="cast-section">
            <div className="section-heading">
              <span>CAST</span>
              <h2>주요 출연진</h2>
            </div>

            <div className="cast-grid">
              {cast.map((person) => {
                const profile = getImageUrl(person.profile_path, "w300");

                return (
                  <article className="cast-card" key={person.cast_id || person.id}>
                    {profile ? (
                      <img src={profile} alt={person.name} loading="lazy" />
                    ) : (
                      <div className="image-placeholder">NO IMAGE</div>
                    )}
                    <div>
                      <strong>{person.name}</strong>
                      <p>{person.character || "배역 정보 없음"}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <ReviewForm movieId={movie.id} movieTitle={movie.title} />
      </div>
    </>
  );
}
