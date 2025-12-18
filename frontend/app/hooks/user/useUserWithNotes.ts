import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { User } from "@/app/types/types";

export const useUserWithNotes = (userId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/${userId}`);
      return data;
    },
    enabled,
  });
};
