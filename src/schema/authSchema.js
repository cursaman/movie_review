import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력하세요.").email("이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상 입력하세요."),
});

export const signupSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력하세요."),
  email: z.string().min(1, "이메일을 입력하세요.").email("이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상 입력하세요."),
  passwordConfirm: z.string().min(8, "비밀번호 확인을 입력하세요."),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "비밀번호가 일치하지 않습니다.",
});

export const searchSchema = z.object({
  keyword: z.string().trim().min(1, "검색어를 입력하세요.").max(40, "40자 이하로 입력하세요."),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "별점을 선택하세요.").max(5),
  content: z.string().trim().min(10, "리뷰는 10자 이상 입력하세요.").max(500, "500자 이하로 입력하세요."),
});
