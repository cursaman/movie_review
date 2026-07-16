import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../schema/authSchema";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) });

  function onSubmit(data) {
    try {
      setServerError(""); signup(data); navigate("/", { replace: true });
    } catch (error) { setServerError(error.message); }
  }

  return <section className="auth-page"><title>회원가입 | 무비로그</title><div className="auth-card">
    <span className="eyebrow">SIGN UP</span><h1>회원가입</h1><p>수업용 localStorage 회원 시스템입니다.</p>
    <form className="form-stack" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>이름<input placeholder="이름" {...register("name")} /></label>{errors.name && <p className="form-error">{errors.name.message}</p>}
      <label>이메일<input type="email" placeholder="movie@example.com" {...register("email")} /></label>{errors.email && <p className="form-error">{errors.email.message}</p>}
      <label>비밀번호<input type="password" placeholder="8자 이상" {...register("password")} /></label>{errors.password && <p className="form-error">{errors.password.message}</p>}
      <label>비밀번호 확인<input type="password" placeholder="비밀번호 재입력" {...register("passwordConfirm")} /></label>{errors.passwordConfirm && <p className="form-error">{errors.passwordConfirm.message}</p>}
      {serverError && <p className="form-error form-error--box">{serverError}</p>}
      <button className="button button--primary" disabled={isSubmitting}>회원가입</button>
    </form>
    <p className="auth-link">이미 계정이 있나요? <Link to="/login">로그인</Link></p>
  </div></section>;
}
