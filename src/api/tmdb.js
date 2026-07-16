const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
const API_KEY = "b9fba3ed47fef961ca8018c959acc003";

async function request(path, params = {}) {
  const searchParams = new URLSearchParams({ api_key: API_KEY, language: "ko-KR", ...params });
  const response = await fetch(`${BASE_URL}${path}?${searchParams}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.status_message || `TMDB 요청 실패: ${response.status}`);
  return data;
}

export const getNowPlayingMovies = (page=1) => request("/movie/now_playing", { page, region: "KR" });
export const getPopularMovies = (page=1) => request("/movie/popular", { page, region: "KR" });
export const getTopRatedMovies = (page=1) => request("/movie/top_rated", { page, region: "KR" });
export const getMovieDetail = (id) => request(`/movie/${id}`, { append_to_response: "videos,credits,release_dates" });
export const searchMovies = (query, page=1) => request("/search/movie", { query, page, include_adult: "false", region: "KR" });
export function getImageUrl(path, size="w500") { return path ? `${IMAGE_URL}/${size}${path}` : ""; }
