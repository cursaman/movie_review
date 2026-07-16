import MovieCard from "./MovieCard";

export default function MovieSection({ eyebrow, title, movies }) {
  return (
    <section className="movie-section">
      <div className="container">
        <div className="section-heading">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>

        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
