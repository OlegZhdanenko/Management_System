import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export function useAssignAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
      api.put(`/users/assign-admin`, { userId, groupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("You assign admin for group successfully");
    },
    onError: () => {
      toast.error("Failed to assign admin");
    },
  });
}
