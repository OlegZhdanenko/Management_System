import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../../components/user/createUserForm";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { data: res } = await api.post("/users", data);
      return res;
    },
    onSuccess: () => toast.success("You create user for group successfully"),
    onError: () => toast.error("Failed create user for group "),
  });
}
