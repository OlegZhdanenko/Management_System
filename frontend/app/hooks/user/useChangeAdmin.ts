import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

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
      toast.success("You change admin for group successfully");
    },
    onError: () => {
      toast.error("Failed to change admin");
    },
  });
}
