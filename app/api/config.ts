const API_URL = "http://localhost/api";

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}
