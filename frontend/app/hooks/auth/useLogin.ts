import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../../lib/axios";

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },

    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      qc.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
  });
};
