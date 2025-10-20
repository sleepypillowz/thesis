"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Appointment {
  id: string;
  appointment_date: string;
}

interface DoctorInfo {
  id: string;
  full_name: string;
  email: string;
  role: string;
  specialization: string;
}

interface Referral {
  id: string;
  referring_doctor: DoctorInfo;
  patient: string;
  receiving_doctor: DoctorInfo;
  reason: string;
  notes: string;
  status: string;
  appointment: Appointment | null;
  created_at: string;
  updated_at: string;
}

interface DoctorAvailability {
  start: string;
  end: string;
  is_available: boolean;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  email: string;
  timezone: string;
  availability?: DoctorAvailability[];
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export default function ReferralScheduler() {
  const [referrals, setReferrals] = React.useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] =
    React.useState<Referral | null>(null);
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [availability, setAvailability] = React.useState<
    Record<string, TimeSlot[]>
  >({});
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [loadingReferrals, setLoadingReferrals] = React.useState(true);
  const [loadingDoctor, setLoadingDoctor] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("access");
    setLoadingReferrals(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/appointment-referral-list/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Referral[]) => {
        setReferrals(data);
        setLoadingReferrals(false);
      })
      .catch((error) => {
        console.error("Error fetching referrals:", error);
        setLoadingReferrals(false);
      });
  }, []);

  React.useEffect(() => {
    if (!selectedReferral) return;
    const token = localStorage.getItem("access");
    setLoadingDoctor(true);

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/appointment/doctor-schedule/${selectedReferral.receiving_doctor.id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: Doctor) => {
        const slotsByDate: Record<string, TimeSlot[]> = {};
        (data.availability || []).forEach((slot) => {
          const dateKey = format(new Date(slot.start), "yyyy-MM-dd");
          if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
          slotsByDate[dateKey].push({
            id: `${dateKey}-${slot.start}`,
            start: slot.start,
            end: slot.end,
            available: slot.is_available,
          });
        });

        setDoctor(data);
        setAvailability(slotsByDate);
        setLoadingDoctor(false);
      })
      .catch((error) => {
        console.error("Error fetching doctor's schedule:", error);
        setLoadingDoctor(false);
      });
  }, [selectedReferral]);

  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";
  const slotsForDate = selectedDateKey
    ? availability[selectedDateKey] || []
    : [];

  const handleSchedule = () => {
    if (!selectedReferral || !selectedSlot || !doctor) return;

    const slot = slotsForDate.find((s) => s.id === selectedSlot);
    if (!slot) return;

    setIsScheduling(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/appointment/schedule-appointment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access")
          ? `Bearer ${localStorage.getItem("access")}`
          : "",
      },
      body: JSON.stringify({
        referral_id: selectedReferral.id,
        appointment_date: slot.start,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Scheduling failed");
        return res.json();
      })
      .then(() => {
        setIsScheduling(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedReferral(null);
          setSelectedSlot(null);
          setAvailability({});
        }, 2000);
      })
      .catch((error) => {
        console.error("Error scheduling appointment:", error);
        setIsScheduling(false);
      });
  };

  // New time formatting function
  const formatTime = (dateString: string, timeZone: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
  };

  // New time comparison function
  const isSlotPast = (endTime: string, timeZone: string) => {
    const now = new Date();
    const slotEnd = new Date(endTime);

    // Convert to doctor's timezone for comparison
    const doctorNow = new Date(now.toLocaleString("en-US", { timeZone }));
    const doctorSlotEnd = new Date(
      slotEnd.toLocaleString("en-US", { timeZone })
    );

    return doctorSlotEnd < doctorNow;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Referral Appointment Scheduling
          </h1>
          <p className="text-gray-600">
            Select a referral and available time slot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="h-[600px] overflow-y-auto border-r p-4">
            <h2 className="mb-4 text-lg font-semibold">Pending Referrals</h2>
            <div className="space-y-3">
              {loadingReferrals ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <Skeleton className="mb-2 h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="mt-2 h-4 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-2/3" />
                    </div>
                  ))
              ) : referrals.length > 0 ? (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    onClick={() => setSelectedReferral(referral)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReferral?.id === referral.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">Referral #{referral.id}</h3>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {referral.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Patient ID: {referral.patient}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Specialist:</span>{" "}
                      {referral.receiving_doctor.full_name} - {referral.receiving_doctor.specialization}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Reason:</span>{" "}
                      {referral.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pending referrals found</p>
              )}
            </div>
          </div>

          <div className="col-span-2 p-6">
            {!selectedReferral ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Please select a referral from the list
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  {loadingDoctor ? (
                    <div className="space-y-4">
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mb-1 h-4 w-24" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Patient ID
                        </p>
                        <p>{selectedReferral.patient}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Specialist
                        </p>
                        <p>
                          {doctor?.full_name} - {doctor?.specialization}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">
                          Reason
                        </p>
                        <p>{selectedReferral.reason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-md border p-4">
                  {loadingDoctor ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Skeleton className="mb-4 h-8 w-48" />
                      <div className="grid grid-cols-7 gap-2">
                        {Array(35)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-8 w-8" />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow"
                      disabled={(date) => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        return (
                          !availability[dateKey] ||
                          !availability[dateKey].some((s) => s.available)
                        );
                      }}
                    />
                  )}
                </div>

                {date && (
                  <div>
                    <h3 className="mb-3 font-medium">
                      Available Slots for {format(date, "MMMM d, yyyy")}
                    </h3>

                    {loadingDoctor ? (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-lg" />
                          ))}
                      </div>
                    ) : slotsForDate.length === 0 ? (
                      <p className="text-gray-500">
                        No available slots for this date
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {slotsForDate.map((slot) => {
                          const doctorTimezone = doctor?.timezone || "UTC";
                          const isPast = isSlotPast(slot.end, doctorTimezone);
                          const isTaken = !slot.available;
                          const disabled = isPast || isTaken;

                          return (
                            <button
                              key={slot.id}
                              onClick={() =>
                                !disabled && setSelectedSlot(slot.id)
                              }
                              disabled={disabled}
                              className={`p-3 border rounded-lg text-center transition-colors ${
                                selectedSlot === slot.id
                                  ? "bg-blue-100 border-blue-500"
                                  : disabled
                                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="font-medium">
                                {formatTime(slot.start, doctorTimezone)} -{" "}
                                {formatTime(slot.end, doctorTimezone)}
                              </div>
                              {isTaken && (
                                <div className="mt-1 text-xs text-red-500">
                                  Taken
                                </div>
                              )}
                              {isPast && (
                                <div className="mt-1 text-xs text-red-500">
                                  Passed
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedReferral(null);
                      setSelectedSlot(null);
                      setDoctor(null);
                      setAvailability({});
                    }}
                    className="rounded-md border px-4 py-2 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedSlot || isScheduling}
                    className={`px-4 py-2 rounded-md text-white ${
                      isScheduling
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Appointment"}
                  </button>
                </div>

                {success && (
                  <div className="rounded border border-green-400 bg-green-100 p-3 text-green-700">
                    Appointment scheduled successfully!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}