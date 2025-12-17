import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../../lib/axios";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const qc = useQueryClient();
  const router = useRouter();
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
      router.push("/dashboard");
    },
  });
};
