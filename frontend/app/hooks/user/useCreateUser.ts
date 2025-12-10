import { useMutation } from "@tanstack/react-query";
import { UserFormValues } from "../../components/user/createUserForm";
import { api } from "../../lib/axios";

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { data: res } = await api.post("/users", data);
      return res;
    },
  });
}
