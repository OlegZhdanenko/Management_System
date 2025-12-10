import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

interface ChangeAdminPayload {
  groupId: string;
  newAdminId: string;
}

export function useChangeAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeAdminPayload) =>
      api.put(`/groups/${payload.groupId}`, {
        adminId: payload.newAdminId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err) => {
      console.error("Failed to change admin", err);
    },
  });
}
