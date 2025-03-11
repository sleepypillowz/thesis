import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  role?: string;
  first_name?: string;
  last_name?: string;
}

export default function useUserInfo() {
  const [userInfo, setUserInfo] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.role) {
          decoded.role = decoded.role.toLowerCase(); // normalize role if needed
        }
        setUserInfo(decoded);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return userInfo;
}
