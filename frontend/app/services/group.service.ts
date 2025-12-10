import { api } from "../lib/axios";
export const GroupService = {
  async create(payload: { name: string; description?: string }) {
    const { data } = await api.post("/groups", payload);
    return data;
  },

  async getAll() {
    const { data } = await api.get("/groups");
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/groups/${id}`);
    return data;
  },
};
