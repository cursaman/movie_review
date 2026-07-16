import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema } from "../schema/authSchema";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  function onSubmit(data) {
    try {
      setServerError("");
      login(data);
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) { setServerError(error.message); }
  }

  return <section className="auth-page"><title>로그인 | 무비로그</title><div className="auth-card">
    <span className="eyebrow">LOGIN</span><h1>로그인</h1><p>리뷰 작성과 나만의 영화 기록을 시작하세요.</p>
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>이메일<input type="email" placeholder="movie@example.com" {...register("email")} /></label>
      {errors.email && <p className="form-error">{errors.email.message}</p>}
      <label>비밀번호<input type="password" placeholder="8자 이상" {...register("password")} /></label>
      {errors.password && <p className="form-error">{errors.password.message}</p>}
      {serverError && <p className="form-error form-error--box">{serverError}</p>}
      <button className="button button--primary" disabled={isSubmitting}>로그인</button>
    </form>
    <p className="auth-link">계정이 없나요? <Link to="/signup">회원가입</Link></p>
  </div></section>;
}
