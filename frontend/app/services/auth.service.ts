import { api } from "../lib/axios";

export const AuthService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  async logout() {
    const { data } = await api.post("/auth/logout");
    return data;
  },
};
