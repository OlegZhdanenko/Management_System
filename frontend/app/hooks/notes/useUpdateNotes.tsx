import { api } from "@/app/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "./useCreateNotes";

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: Note }) => {
      const { data } = await api.put(`/notes/${id}`, note);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
