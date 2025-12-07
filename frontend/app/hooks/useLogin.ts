import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";
import { LoginPayload, LoginResponse } from "../types/types";

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: AuthService.login,
    onSuccess: (data: LoginResponse) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      qc.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
