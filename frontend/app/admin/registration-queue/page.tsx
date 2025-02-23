"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/queueing/registration_queueing/")
      .then((response) => response.json())
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

  const router = useRouter();

  const confirmAccept = (patientId: string) => {
    console.log(`Patient with ID ${patientId} accepted`);
    setIsModalOpen(false);
    // Add API call or state update logic here
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
                onClick={() => {
                  setSelectedPatient(queueItem);
                  setIsModalOpen(true);
                }}
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

  return (
    <div className="flex-1 px-8 py-8">
      {/* Top Label */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Patient Registration Queue</h1>
      </div>

      <h2 className="text-xl font-semibold">Priority Queue</h2>
      <div className="flex flex-row justify-center gap-4">
        {renderPatientInfo(priorityQueue.current)}
      </div>

      <h2 className="text-xl font-semibold">Regular Queue</h2>
      <div className="flex flex-row justify-center gap-4">
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
