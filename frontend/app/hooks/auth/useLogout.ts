import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../services/auth.service";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");

    qc.setQueryData(["currentUser"], null);
    router.push("/");
  };

  return logout;
};
