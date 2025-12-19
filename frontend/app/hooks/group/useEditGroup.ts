import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

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
      toast.success("Group successfully edit!");
    },
    onError: () => {
      toast.error("Failed to edit group!");
    },
  });

  return mutation;
}
