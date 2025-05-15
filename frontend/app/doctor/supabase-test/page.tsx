// "use client";
// import { supabase } from "@/config/supabase";
// import { useEffect, useState } from "react";

// interface Smoothie {
//   id: number;
//   title: string;
// }

// export default function Page() {
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [smoothies, setSmoothies] = useState<Smoothie[]>([]);

//   useEffect(() => {
//     const fetchSmoothies = async () => {
//       const { data, error } = await supabase.from("smoothies").select("*");

//       if (error) {
//         setFetchError("Could not fetch the smoothies");
//         setSmoothies([]);
//         console.error("Fetch Error:", error);
//       } else if (data) {
//         console.log("Fetched Data:", data); // Debugging
//         setSmoothies(data as Smoothie[]);
//         setFetchError(null);
//       }
//     };

//     fetchSmoothies();
//   }, []);

//   return (
//     <div>
//       {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

//       {smoothies.length > 0 ? (
//         <div>
//           <h2>Smoothies List</h2>
//           {smoothies.map((smoothie) => (
//             <p key={smoothie.id}>{smoothie.title}</p>
//           ))}
//         </div>
//       ) : (
//         !fetchError && <p>Loading or no smoothies found...</p>
//       )}
//     </div>
//   );
// }
