import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

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
    toast.success("Successfully logout!");
  };

  return logout;
};
