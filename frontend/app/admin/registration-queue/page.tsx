"use client";
<<<<<<< HEAD

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

// PatientQueueItem interface
export interface PatientQueueItem {
  patient_id: string;
=======
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PatientQueueItem {
>>>>>>> main
  first_name: string;
  last_name: string;
  age: number;
  complaint: string;
  phone_number?: string;
<<<<<<< HEAD
  queue_number: number;
=======
>>>>>>> main
}

export default function Page() {
  const [priorityQueue, setPriorityQueue] = useState({
    current: null as PatientQueueItem | null,
    next1: null as PatientQueueItem | null,
    next2: null as PatientQueueItem | null,
  });
<<<<<<< HEAD

=======
>>>>>>> main
  const [regularQueue, setRegularQueue] = useState({
    current: null as PatientQueueItem | null,
    next1: null as PatientQueueItem | null,
    next2: null as PatientQueueItem | null,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/queueing/registration_queueing/")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
<<<<<<< HEAD

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
=======
        setPriorityQueue({
          current: data.priority_current,
          next1: data.priority_next1,
          next2: data.priority_next2,
        });
        setRegularQueue({
          current: data.regular_current,
          next1: data.regular_next1,
          next2: data.regular_next2,
        });
>>>>>>> main
      })
      .catch((error) => console.error("Error fetching queue:", error));
  }, []);

<<<<<<< HEAD
  const router = useRouter();
=======
>>>>>>> main
  const renderPatientInfo = (queueItem: PatientQueueItem | null) => {
    if (!queueItem) return null;
    return (
      <div className="flex justify-center pt-8">
        <div className="card flex w-96 max-w-sm flex-col rounded-lg">
          <p className="mb-2 text-lg font-semibold tracking-tight">Patient Information</p>
          <div className="flex">
            <p>
              <span>Name: </span>{queueItem.first_name} {queueItem.last_name}
            </p>
            <p className="pl-8">
              <span>Age: </span>{queueItem.age}
            </p>
          </div>
          <hr className="mt-2" />
          <p className="my-2 text-lg font-semibold tracking-tight">Additional Information</p>
          <p>
            <span>Phone number: </span>{queueItem.phone_number || "N/A"}
          </p>
          <p>
            <span>Reason: </span>{queueItem.complaint || "N/A"}
          </p>
          <div className="flex flex-col pt-6">
            <div className="flex justify-between">
<<<<<<< HEAD
              <button
                onClick={() => {
                  if (!queueItem?.patient_id || !queueItem?.queue_number) {
                    console.error("Missing patient_id or queue_number");
                    return;
                  }
                  router.push(`/admin/patient-preliminary-assessment/${queueItem.patient_id}/${queueItem.queue_number}/`);
                }}
                className={buttonVariants({ variant: "outline" })}
              >
                Accept
              </button>

              <button className={buttonVariants({ variant: "outline" })} onClick={() => router.push("/payments")}>
                Edit
              </button>
            </div>
            <button className={buttonVariants({ variant: "outline" })} onClick={() => router.push("/payments")}>
              Cancel
            </button>
=======
              <Link className={buttonVariants({ variant: "outline" })} href="/payments">
                Accept
              </Link>
              <Link className={buttonVariants({ variant: "outline" })} href="/payments">
                Edit
              </Link>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/payments">
              Cancel
            </Link>
>>>>>>> main
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 px-8 py-8">
      <h1>Priority Queue</h1>
      <div className="flex flex-row justify-center gap-4">
        {/* Priority Queue Cards */}
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold">{priorityQueue.current ? `#${priorityQueue.current.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{priorityQueue.current ? 1 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold">{priorityQueue.next1 ? `#${priorityQueue.next1.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{priorityQueue.next1 ? 2 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold">{priorityQueue.next2 ? `#${priorityQueue.next2.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{priorityQueue.next2 ? 3 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(priorityQueue.current)}
      </div>

      <h1>Regular Queue</h1>
      <div className="flex flex-row justify-center gap-4">
        {/* Regular Queue Cards */}
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold">{regularQueue.current ? `#${regularQueue.current.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{regularQueue.current ? 1 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold"> {regularQueue.next1 ? `#${regularQueue.next1.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{regularQueue.next1 ? 2 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
<<<<<<< HEAD
          <p className="text-6xl font-bold"> {regularQueue.next2 ? `#${regularQueue.next2.queue_number}` : "N/A"}</p>
=======
          <p className="text-6xl font-bold">#{regularQueue.next2 ? 3 : "N/A"}</p>
>>>>>>> main
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(regularQueue.current)}
      </div>
    </div>
  );
}
