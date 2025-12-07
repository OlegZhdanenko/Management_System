import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: AuthService.me,
    retry: false,
  });
