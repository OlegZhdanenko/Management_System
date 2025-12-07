import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/auth.service";

export const useLogout = () => {
  const qc = useQueryClient();

  const logout = async () => {
    try {
      await AuthService.logout(); // можно оставить, если сервер обнуляет токен
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("token");

    qc.setQueryData(["currentUser"], null);
  };

  return logout;
};
