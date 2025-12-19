import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export interface GroupDto {
  name: string;
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GroupDto) => {
      const { data: res } = await api.post("/groups", data);
      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group successfully created!");
    },

    onError: (err) => {
      console.error("Failed to create group:", err);
      toast.error(`${err}`);
    },
  });
}
