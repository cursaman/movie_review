import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "movie-users";
const SESSION_KEY = "movie-current-user";

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null));

  function signup({ name, email, password }) {
    const users = readJson(USERS_KEY, []);
    if (users.some((item) => item.email === email)) {
      throw new Error("이미 가입된 이메일입니다.");
    }
    const nextUser = { id: crypto.randomUUID(), name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
    const session = { id: nextUser.id, name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  function login({ email, password }) {
    const users = readJson(USERS_KEY, []);
    const found = users.find((item) => item.email === email && item.password === password);
    if (!found) throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    const session = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({ user, signup, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  return context;
}
