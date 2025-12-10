import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

interface EditGroupPayload {
  id: string;
  name?: string;
  users?: string[];
  notes?: string;
}

export function useEditGroup() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: EditGroupPayload) =>
      api.put(`/groups/${payload.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err) => {
      console.error("Failed to edit group", err);
    },
  });

  return mutation;
}
