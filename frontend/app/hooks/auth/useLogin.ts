import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../../lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface LoginPayload {
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}

interface LoginResponse {
  token?: string;
  needsVerification?: boolean;
  email: string;
}
export const useLogin = () => {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation<LoginResponse, AxiosError<ApiError>, LoginPayload>({
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
      if (!data.needsVerification) {
        router.push("/dashboard");
      }
      toast.success("Successfully login!");
    },
    onError: (err) => {
      toast.error(`${err.response?.data.message}`);
    },
  });
};
