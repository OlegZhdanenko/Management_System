import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export function useAssignAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, groupId }: { userId: string; groupId: string }) =>
      api.put(`/users/assign-admin`, { userId, groupId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
