import { api } from "../lib/axios";

export const NoteService = {
  async create(payload: {
    title: string;
    content: string;
    groupId?: string;
    userId?: string;
  }) {
    const { data } = await api.post("/notes", payload);
    return data;
  },

  async getAll() {
    const { data } = await api.get("/notes");
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },
};
