import { useEffect, useState } from "react";
import { getRole } from "@/utils/auth";

export function useRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  return role;
}
