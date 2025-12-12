import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../lib/axios";

export const useLogout = () => {
  const qc = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");
    qc.clear();
    router.push("/");
  };

  return logout;
};
