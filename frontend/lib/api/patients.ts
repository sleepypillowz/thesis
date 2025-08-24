// utils/medical-record.ts
import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface patients {
  name: string;
  status: string;
}

// Generic fetch function with access token
const fetchData = async <T>(endpoint: string): Promise<T> => {
  const accessToken = localStorage.getItem("access"); // get token from localStorage

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // add token here
      'Content-Type': 'application/json',   // optional but good practice
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Generic useQuery hook
const useQuery = <T>(queryFn: () => Promise<T>): T | null => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        console.log("Starting API call...");
        const result = await queryFn();
        console.log("API call successful:", result);
        setData(result);
      } catch (err) {
        console.error("Detailed error:", err);
        setData(null);
      }
    };

    fetchDataAsync();
  }, [queryFn]);

  return data;
};

// API object
export const api = {
  patients: {
    getPatients: () => fetchData<patients[]>("/patients/"),
  },
};

// Export useQuery for easy usage
export { useQuery };
