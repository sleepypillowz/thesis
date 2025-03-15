"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import userInfo from "@/components/hooks/userRole";

// PatientQueueItem interface
export interface PatientQueueItem {
  patient_id: string;
  first_name: string;
  last_name: string;
  age: number;
  complaint: string;
  phone_number?: string;
  queue_number: number;
  status?: string;
}

export default function Page() {
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
  const [selectedPatient, setSelectedPatient] =
    useState<PatientQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/queueing/registration_queueing/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include the token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);

        // Extract priority patients and sort by timestamp
        const priorityPatients = [
          data.priority_current,
          data.priority_next1,
          data.priority_next2,
        ].filter((p) => p !== null); // Remove null values

        // Extract regular patients and sort by timestamp
        const regularPatients = [
          data.regular_current,
          data.regular_next1,
          data.regular_next2,
        ].filter((p) => p !== null); // Remove null values

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

        console.log("Priority Queue:", priorityQueue);
        console.log("Regular Queue:", regularQueue);
      })
      .catch((error) => console.error("Error fetching queue:", error));
  }, [priorityQueue, regularQueue]);
  const handleAccept = (queueItem: PatientQueueItem) => {
    setSelectedPatient(queueItem);
    setIsModalOpen(true);
  };

  const confirmAccept = async (patient_id: string) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "http://127.0.0.1:8000/patient/update-status/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient_id: patient_id, // ✅ Ensure you're sending the correct ID
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      router.push("/secretary/patient-assessment-queue");
    } catch (error) {
      console.error("❌ Error updating queue:", error);
    }
  };

  const renderPatientInfo = (queueItem: PatientQueueItem | null) => {
    if (!queueItem) return null;
    return (
      <div className="flex justify-center pt-8">
        <div className="card flex w-96 max-w-sm flex-col rounded-lg">
          <p className="mb-2 text-lg font-semibold tracking-tight">
            Patient Information
          </p>
          <div className="flex">
            <p>
              <span>Name: </span>
              {queueItem.first_name} {queueItem.last_name}
            </p>
            <p className="pl-8">
              <span>Age: </span>
              {queueItem.age}
            </p>
          </div>
          <hr className="mt-2" />
          <p className="my-2 text-lg font-semibold tracking-tight">
            Additional Information
          </p>
          <p>
            <span>Phone number: </span>
            {queueItem.phone_number || "N/A"}
          </p>
          <p>
            <span>Reason: </span>
            {queueItem.complaint || "N/A"}
          </p>
          <div className="flex flex-col pt-6">
            <div className="flex justify-between">
              <button
                onClick={() => handleAccept(queueItem)}
                className={buttonVariants({ variant: "outline" })}
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
    <div className="flex-1 px-8 py-8">
      <h1 className="text-2xl font-bold">Patient Registration Queue</h1>
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
            {" "}
            {regularQueue.next1 ? `#${regularQueue.next1.queue_number}` : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">
            {" "}
            {regularQueue.next2 ? `#${regularQueue.next2.queue_number}` : "N/A"}
          </p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(regularQueue.current)}
      </div>
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <p className="text-lg font-semibold">
              Are you sure you want to accept this patient?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="rounded-md bg-gray-300 px-4 py-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() =>
                  selectedPatient && confirmAccept(selectedPatient.patient_id)
                }
              >
                Yes, Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
