import { apiRequest } from "./apiClient";

export function login(email, password) {
  return apiRequest("/auth/login", "POST", { email, password });
}
