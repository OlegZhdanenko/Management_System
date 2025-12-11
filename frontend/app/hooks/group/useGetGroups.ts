import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";
export interface Creator {
  created_at: string;
  email: string;
  id: string;
  name: string;
  password: string;
  role: "ADMIN" | "USER";
  token: string | null;
  updated_at: string;
}
export interface Group {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  creator: Creator;
}

export function useGetGroups() {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data } = await api.get("/groups");
      return data;
    },
  });
}
