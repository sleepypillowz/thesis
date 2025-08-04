"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email?: string;
  role?: string;
}

export default function Username() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);
        setUser(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <div>
      {user && <span className="text-sm font-semibold">{user.email}</span>}
    </div>
  );
}
