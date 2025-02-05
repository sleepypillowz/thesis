"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PatientQueueItem {
  first_name: string;
  last_name: string;
  age: number;
  complaint: string;
  phone_number?: string;
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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/queueing/registration_queueing/")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
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
      })
      .catch((error) => console.error("Error fetching queue:", error));
  }, []);

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
          <p className="text-6xl font-bold">#{priorityQueue.current ? 1 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#{priorityQueue.next1 ? 2 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#{priorityQueue.next2 ? 3 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(priorityQueue.current)}
      </div>

      <h1>Regular Queue</h1>
      <div className="flex flex-row justify-center gap-4">
        {/* Regular Queue Cards */}
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#{regularQueue.current ? 1 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Current</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#{regularQueue.next1 ? 2 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#{regularQueue.next2 ? 3 : "N/A"}</p>
          <span>Queuing Number</span>
          <span>Next</span>
        </div>

        {renderPatientInfo(regularQueue.current)}
      </div>
    </div>
  );
}
