import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../../components/user/createUserForm";
import { api } from "../../lib/axios";

export function useCreateAdmin() {
  return useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { data: res } = await api.post("/users/createAdmin", {
        ...data,
        role: "ADMIN",
      });
      return res;
    },
  });
}
