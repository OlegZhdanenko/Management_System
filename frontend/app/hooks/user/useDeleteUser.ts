"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/axios";
import toast from "react-hot-toast";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete(`/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("You delete user successfully");
    },
    onError: () => toast.error("Failed to delete user"),
  });
}
