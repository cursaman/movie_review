import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Link className="footer__logo" to="/">
            무비로그
          </Link>
          <p>영화 정보와 나만의 감상을 기록하는 React 프로젝트</p>
        </div>

        <div className="footer__meta">
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
          <small>© {new Date().getFullYear()} Movie Log</small>
        </div>
      </div>
    </footer>
  );
}
