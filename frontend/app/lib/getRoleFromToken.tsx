import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role?: string;
  email?: string;
  id?: string;
}

export function getRoleFromToken(token: string | null): TokenPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (!decoded || typeof decoded !== "object") return null;

    return decoded ?? null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
