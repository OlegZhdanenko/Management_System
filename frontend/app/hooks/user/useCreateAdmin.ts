import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../../components/user/createUserForm";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export function useCreateAdmin() {
  return useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { data: res } = await api.post("/users/createAdmin", {
        ...data,
        role: "ADMIN",
      });
      return res;
    },
    onSuccess: () => toast.success("You create admin for group successfully"),
    onError: () => toast.error("Failed create admin for group "),
  });
}
