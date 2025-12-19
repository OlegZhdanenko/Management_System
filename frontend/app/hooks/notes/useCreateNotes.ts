import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { queryClient } from "@/app/services/react-query";
import toast from "react-hot-toast";

export interface Note {
  title: string;
  content: string;
  userId?: string | null;
}

export function useCreateNote() {
  return useMutation({
    mutationFn: async (data: Note) => {
      const { data: res } = await api.post("/notes", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Note successfully created!");
    },
    onError: () => {
      toast.error("Failed to create note!");
    },
  });
}
