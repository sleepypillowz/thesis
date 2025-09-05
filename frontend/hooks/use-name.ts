import { useEffect, useState } from "react";
import { getName } from "@/utils/auth";

export function useName() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setName(await getName());
    })();
  }, []);

  return name;
}
