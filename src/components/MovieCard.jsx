import { Link } from "react-router-dom";
import { getImageUrl } from "../api/tmdb";

export default function MovieCard({ movie }) {
  const poster = getImageUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) || "개봉일 미정";
  const score = Number(movie.vote_average || 0).toFixed(1);

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} aria-label={`${movie.title} 상세 보기`}>
        <div className="movie-card__image">
          {poster ? (
            <img src={poster} alt={`${movie.title} 포스터`} loading="lazy" />
          ) : (
            <div className="image-placeholder">NO IMAGE</div>
          )}
          <span className="movie-card__score">★ {score}</span>
        </div>

        <div className="movie-card__body">
          <h3>{movie.title}</h3>
          <p>{year}</p>
        </div>
      </Link>
    </article>
  );
}
