import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";

export interface CreateNoteDto {
  title: string;
  content: string;
  groupId?: string;
  userId?: string;
}

export function useCreateNote() {
  return useMutation({
    mutationFn: async (data: CreateNoteDto) => {
      const { data: res } = await api.post("/notes", data);
      return res;
    },
  });
}
