import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Admins {
  id: string;
  email: string;
  name: string;
}
export function useGetAdmins() {
  return useQuery<Admins[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data } = await api.get("users/admins");
      return data;
    },
  });
}
