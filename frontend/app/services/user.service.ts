import { api } from "../lib/axios";

export const UserService = {
  async create(payload: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    const { data } = await api.post("/users", payload);
    return data;
  },

  async getAll() {
    const { data } = await api.get("/users");
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
