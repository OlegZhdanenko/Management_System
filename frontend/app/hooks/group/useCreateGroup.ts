import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface GroupDto {
  name: string;
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: async (data: GroupDto) => {
      const { data: res } = await api.post("/groups", data);
      return res;
    },
  });
}
