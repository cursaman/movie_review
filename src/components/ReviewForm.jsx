import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { reviewSchema } from "../schema/authSchema";
import { useAuth } from "../context/AuthContext";

export default function ReviewForm({ movieId, movieTitle }) {
  const { user } = useAuth();
  const location = useLocation();
  const [savedReview, setSavedReview] = useState(null);
  const key = user ? `movie-review-${user.id}-${movieId}` : "";
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, content: "" } });
  const rating = Number(watch("rating"));

  useEffect(() => { if (!key) return; try { setSavedReview(JSON.parse(localStorage.getItem(key))); } catch { setSavedReview(null); } }, [key]);
  function onSubmit(data) { const review = { ...data, movieId, movieTitle, userName: user.name, createdAt: new Date().toISOString() }; localStorage.setItem(key, JSON.stringify(review)); setSavedReview(review); reset(); }
  function remove() { localStorage.removeItem(key); setSavedReview(null); reset(); }

  return <section className="review-box"><div className="section-heading"><span>MY REVIEW</span><h2>영화 리뷰 작성</h2></div>
    {!user ? <div className="login-required"><p>리뷰를 작성하려면 로그인이 필요합니다.</p><Link className="button button--primary" to="/login" state={{ from: location.pathname }}>로그인하기</Link></div>
    : savedReview ? <article className="saved-review"><div className="saved-review__top"><strong>{"★".repeat(savedReview.rating)}</strong><time>{new Date(savedReview.createdAt).toLocaleDateString("ko-KR")}</time></div><p>{savedReview.content}</p><button className="button button--line" onClick={remove}>리뷰 삭제</button></article>
    : <form className="review-form" onSubmit={handleSubmit(onSubmit)} noValidate><fieldset><legend>별점 선택</legend><input type="hidden" {...register("rating")} /><div className="rating-buttons">{[1,2,3,4,5].map(v => <button key={v} type="button" className={v <= rating ? "is-selected" : ""} onClick={() => setValue("rating", v, { shouldValidate: true })}>★</button>)}</div>{errors.rating && <p className="form-error">{errors.rating.message}</p>}</fieldset><label htmlFor="review-content">감상평</label><textarea id="review-content" rows="6" placeholder="10자 이상 500자 이하" {...register("content")} />{errors.content && <p className="form-error">{errors.content.message}</p>}<button className="button button--primary">리뷰 저장</button></form>}
  </section>;
}
