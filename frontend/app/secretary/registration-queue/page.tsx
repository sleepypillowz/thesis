"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import userInfo from "@/hooks/userRole";
import QueueTableToggle from "./queue-table-toggle";
import { DashboardTable } from "@/components/ui/dashboard-table";
import { columns } from "./columns";
import { registrations } from "@/lib/placeholder-data";
import PatientRoutingModal from "@/components/pages/PatientRoutingModal";

// PatientQueueItem interface - UPDATED to match backend response
export interface PatientQueueItem {
  id: number;
  patient_id: string | null;
  first_name: string;
  last_name: string;
  age: number | null;
  phone_number?: string;
  date_of_birth?: string;
  complaint: string;
  queue_number: number;
  status?: string;
  priority_level?: string;
  created_at?: string;
  is_new_patient?: boolean;
}

// Patient interface that matches exactly what PatientRoutingModal expects
interface Patient {
  id: number;
  patient_id: string | null;
  patient_name: string;
  queue_number: number;
  priority_level: string;
  complaint: string;
  status: string;
  created_at: string;
  queue_date: string;
}

export default function RegistrationQueue() {
  const [priorityQueue, setPriorityQueue] = useState({
    current: null as PatientQueueItem | null,
    next1: null as PatientQueueItem | null,
    next2: null as PatientQueueItem | null,
  });

  const [regularQueue, setRegularQueue] = useState({
    current: null as PatientQueueItem | null,
    next1: null as PatientQueueItem | null,
    next2: null as PatientQueueItem | null,
  });
  
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueItem | null>(null);
  const [isRoutingModalOpen, setIsRoutingModalOpen] = useState(false);
  const router = useRouter();

  // Function to convert PatientQueueItem to Patient (matching the modal's expected type)
  const convertToPatient = (queueItem: PatientQueueItem | null): Patient | null => {
    if (!queueItem) return null;
    
    return {
      id: queueItem.id,
      patient_id: queueItem.patient_id,
      patient_name: `${queueItem.first_name} ${queueItem.last_name}`,
      queue_number: queueItem.queue_number,
      priority_level: queueItem.priority_level || "Regular",
      complaint: queueItem.complaint,
      status: queueItem.status || "Waiting",
      created_at: queueItem.created_at || new Date().toISOString(),
      queue_date: queueItem.created_at || new Date().toISOString(),
    };
  };

  // Function to safely display age
  const displayAge = (age: number | null | undefined): string => {
    if (age === null || age === undefined) return "N/A";
    return `${age}`;
  };

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const token = localStorage.getItem("access");
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/queueing/registration_queueing/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const data = await resp.json();
        
        console.log("🔍 Initial queue data:", data);
        
        const pr = [data.priority_current, data.priority_next1, data.priority_next2].filter(p => p !== null);
        const rg = [data.regular_current, data.regular_next1, data.regular_next2].filter(p => p !== null);
        
        setPriorityQueue({
          current: pr[0] ?? null,
          next1: pr[1] ?? null,
          next2: pr[2] ?? null,
        });
        setRegularQueue({
          current: rg[0] ?? null,
          next1: rg[1] ?? null,
          next2: rg[2] ?? null,
        });
      } catch (err) {
        console.error("Error fetching queue:", err);
      }
    };

    fetchQueueData();

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const backendHost =
      process.env.NODE_ENV === "production"
        ? "thesis-backend.up.railway.app"
        : "localhost:8000";

    const socket = new WebSocket(`${protocol}://${backendHost}/ws/queue/registration/`);


    socket.onopen = () => {
      console.log("✅ WebSocket connected to registration queue");
    };

    socket.onmessage = (ev) => {
      console.log("📨 Received WebSocket message:", ev.data);
      try {
        const msg = JSON.parse(ev.data);
        console.log("🔄 Parsed WebSocket data:", msg);
        
        const pr = [msg.priority_current, msg.priority_next1, msg.priority_next2].filter(p => p !== null);
        const rg = [msg.regular_current, msg.regular_next1, msg.regular_next2].filter(p => p !== null);
        
        console.log("🎯 Setting Priority Queue:", pr);
        console.log("🎯 Setting Regular Queue:", rg);
        
        setPriorityQueue({
          current: pr[0] ?? null,
          next1: pr[1] ?? null,
          next2: pr[2] ?? null,
        });
        setRegularQueue({
          current: rg[0] ?? null,
          next1: rg[1] ?? null,
          next2: rg[2] ?? null,
        });
        
        console.log("✅ Queue state updated via WebSocket");
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    socket.onclose = (ev) => {
      console.warn("❌ WebSocket closed:", ev);
    };

    socket.onerror = (err) => {
      console.error("💥 WebSocket error:", err);
    };

    // Fallback polling every 30 seconds
    const intervalId = setInterval(fetchQueueData, 30000);

    return () => {
      clearInterval(intervalId);
      socket.close();
    };
  }, []);

  const handleAccept = (queueItem: PatientQueueItem) => {
    console.log("✅ Accepting patient with queue_entry_id:", queueItem.id);
    setSelectedPatient(queueItem);
    setIsRoutingModalOpen(true);
  };

  const handleRoutePatient = async (queueItem: PatientQueueItem | null, action: string) => {
    if (!queueItem) {
      console.error("❌ Queue item is null. Cannot proceed.");
      return;
    }

    try {
      console.log("📤 Sending request with queue_entry_id:", queueItem.id);
      
      const token = localStorage.getItem("access");
      const requestBody = {
        queue_entry_id: queueItem.id,
        action: action,
      };
      
      console.log("📤 Request Body:", requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/patient/update-status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("✅ Success response:", responseData);
      
      // Close the modal - THAT'S IT!
      // The WebSocket will automatically push the updated queue data
      setIsRoutingModalOpen(false);
      setSelectedPatient(null);
      
      // REMOVED: The manual GET request that was causing conflicts
      
    } catch (error) {
      console.error("❌ Error updating queue:", error);
    }
  };

  const renderPatientInfo = (queueItem: PatientQueueItem | null) => {
    if (!queueItem) return null;
    
    return (
      <div className="flex justify-center pt-8">
        <div className="card flex w-96 max-w-sm flex-col rounded-lg p-6 bg-white shadow-md">
          <p className="mb-2 text-lg font-semibold tracking-tight">
            Patient Information
          </p>
          <div className="flex justify-between mb-4">
            <p className="text-sm">
              <span className="font-medium">Name: </span>
              {queueItem.first_name} {queueItem.last_name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Age: </span>
              {displayAge(queueItem.age)}
            </p>
          </div>
          <hr className="my-2" />
          <p className="my-2 text-lg font-semibold tracking-tight">
            Additional Information
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Phone number: </span>
            {queueItem.phone_number || "N/A"}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Queue ID: </span>
            {queueItem.id}
          </p>
          <p className="text-sm mb-4">
            <span className="font-medium">Reason: </span>
            {queueItem.complaint || "N/A"}
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <button
                onClick={() => handleAccept(queueItem)}
                className={buttonVariants({ variant: "default" })}
              >
                Accept
              </button>
              <button
                className={buttonVariants({ variant: "outline" })}
                onClick={() => router.push("/payments")}
              >
                Edit
              </button>
            </div>
            <button
              className={buttonVariants({ variant: "outline" })}
              onClick={() => router.push("/payments")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const user = userInfo();
  const userRole = user?.role;

  if (userRole && !["secretary"].includes(userRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold text-red-600">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }
  
  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-6 px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patient Registration Queue</h1>
        <QueueTableToggle />
      </div>
      
      <h2 className="text-xl font-semibold">Priority Queue</h2>
      <div className="flex flex-row justify-center gap-4">
        {/* Priority Queue Cards */}
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {priorityQueue.current
              ? `#${priorityQueue.current.queue_number}`
              : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {priorityQueue.next1
              ? `#${priorityQueue.next1.queue_number}`
              : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {priorityQueue.next2
              ? `#${priorityQueue.next2.queue_number}`
              : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(priorityQueue.current)}
      </div>

      <h2 className="text-xl font-semibold">Regular Queue</h2>
      <div className="flex flex-row justify-center gap-4">
        {/* Regular Queue Cards */}
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {regularQueue.current
              ? `#${regularQueue.current.queue_number}`
              : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {regularQueue.next1 ? `#${regularQueue.next1.queue_number}` : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {regularQueue.next2 ? `#${regularQueue.next2.queue_number}` : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(regularQueue.current)}
      </div>
      
      <DashboardTable columns={columns} data={registrations ?? []} />
      
      {/* Patient Routing Modal */}
      <PatientRoutingModal
        isOpen={isRoutingModalOpen}
        onClose={() => {
          setIsRoutingModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={convertToPatient(selectedPatient)}
        onRoutePatient={(patient, action) => {
          // Pass the original selectedPatient (PatientQueueItem) to the handler
          handleRoutePatient(selectedPatient, action);
        }}
      />
    </div>
  );
}