import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

interface EditGroupPayload {
  email: string;
  token: string;
}

interface ApiError {
  message: string;
}

interface VerifyResponse {
  message: string;
}

export function useVerify() {
  const queryClient = useQueryClient();

  return useMutation<VerifyResponse, AxiosError<ApiError>, EditGroupPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<VerifyResponse>("/auth/verify", payload);
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message ?? "Successfully verified!");
    },

    onError: () => {
      toast.error("Verification failed");
    },
  });
}
