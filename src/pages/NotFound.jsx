import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <title>페이지를 찾을 수 없습니다 | 무비로그</title>

      <section className="not-found">
        <div>
          <strong>404</strong>
          <h1>페이지를 찾을 수 없습니다.</h1>
          <p>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
          <Link className="button button--primary" to="/">
            홈으로 돌아가기
          </Link>
        </div>
      </section>
    </>
  );
}
