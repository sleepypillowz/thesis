import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
  [key: string]: any;
}

export function getUserRole(): string | null {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
