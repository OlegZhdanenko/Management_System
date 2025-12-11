import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role?: string;
  exp?: number;
  iat?: number;
}

export function getRoleFromToken(token: string | null): string | null {
  if (!token || typeof token !== "string") return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (!decoded || typeof decoded !== "object") return null;

    return decoded.role ?? null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
