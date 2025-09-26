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
  id: number;               // This is the queue_entry_id (779)
  patient_id: string | null; // Can be null for new patients
  first_name: string;
  last_name: string;
  age: number | null;       // Can be null
  complaint: string;
  phone_number?: string;
  queue_number: number;
  status?: string;
  priority_level?: string;
  created_at?: string;
  is_new_patient?: boolean; // Added to match backend
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

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/queueing/registration_queueing/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);

        // Extract priority patients
        const priorityPatients = [
          data.priority_current,
          data.priority_next1,
          data.priority_next2,
        ].filter((p) => p !== null);

        // Extract regular patients
        const regularPatients = [
          data.regular_current,
          data.regular_next1,
          data.regular_next2,
        ].filter((p) => p !== null);

        // Update priority queue state
        setPriorityQueue({
          current: priorityPatients[0] || null,
          next1: priorityPatients[1] || null,
          next2: priorityPatients[2] || null,
        });

        // Update regular queue state
        setRegularQueue({
          current: regularPatients[0] || null,
          next1: regularPatients[1] || null,
          next2: regularPatients[2] || null,
        });
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    };

    fetchQueueData();
    const intervalId = setInterval(fetchQueueData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAccept = (queueItem: PatientQueueItem) => {
    console.log("✅ Accepting patient with queue_entry_id:", queueItem.id);
    setSelectedPatient(queueItem);
    setIsRoutingModalOpen(true);
  };

  const handleRoutePatient = async (queueItem: PatientQueueItem | null, action: string) => {
    // ADD NULL CHECK - This is the main fix
    if (!queueItem) {
      console.error("❌ Queue item is null. Cannot proceed.");
      return;
    }

    try {
      console.log("📤 Sending request with queue_entry_id:", queueItem.id);
      
      const token = localStorage.getItem("access");
      const requestBody = {
        queue_entry_id: queueItem.id, // This should be 779
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
      
      // Close the modal
      setIsRoutingModalOpen(false);
      setSelectedPatient(null);
      
      // Refresh the queue data
      const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/queueing/registration_queueing/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        
        // Update queues with new data
        const priorityPatients = [
          data.priority_current,
          data.priority_next1,
          data.priority_next2,
        ].filter((p) => p !== null);

        const regularPatients = [
          data.regular_current,
          data.regular_next1,
          data.regular_next2,
        ].filter((p) => p !== null);

        setPriorityQueue({
          current: priorityPatients[0] || null,
          next1: priorityPatients[1] || null,
          next2: priorityPatients[2] || null,
        });

        setRegularQueue({
          current: regularPatients[0] || null,
          next1: regularPatients[1] || null,
          next2: regularPatients[2] || null,
        });
      }
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
              {queueItem.age || "N/A"}
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
      
      {/* Patient Routing Modal - REMOVED THE CONVERSION FUNCTION */}
      {/* Pass the original object directly */}
      <PatientRoutingModal
        isOpen={isRoutingModalOpen}
        onClose={() => {
          setIsRoutingModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onRoutePatient={handleRoutePatient}
      />

    </div>
  );
}