import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { Group } from "../group/useGetGroups";

export interface Notes {
  id: string;
  title: string;
  content: string;
  userId?: string;
}

export interface User {
  created_at: string;
  email: string;
  id: string;
  name: string;
  password: string;
  role: "USER";
  token: string | null;
  updated_at: string;
  notes?: Notes[];
  groups?: Group;
}

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users/all");
      return data;
    },
  });
}
