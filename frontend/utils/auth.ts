// utils/auth.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
  [key: string]: any;
}

// Centralized helper
function getAccessToken(): string | null {
  return localStorage.getItem("access");
}

export function getRole(): string | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

export async function getName(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) {
    console.error("No access token found");
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/user/users/current-profile/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch user profile");
      return null;
    }

    const data = await response.json();
    return `${data.first_name} ${data.last_name}`;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}
