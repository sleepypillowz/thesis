"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Referral {
  id: string;
  referring_doctor: string;
  patient: string;
  receiving_doctor: string;
  reason: string;
  notes: string;
  status: string;
  appointment: any;
  created_at: string;
  updated_at: string;
}

interface DoctorAvailability {
  date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  email: string;
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
  const [selectedReferral, setSelectedReferral] = React.useState<Referral | null>(null);
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [availability, setAvailability] = React.useState<Record<string, TimeSlot[]>>({});
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [loadingReferrals, setLoadingReferrals] = React.useState(true);
  const [loadingDoctor, setLoadingDoctor] = React.useState(false);

  // Fetch referrals from Django on mount
  React.useEffect(() => {
    const token = localStorage.getItem("access");
    setLoadingReferrals(true);
    fetch("http://127.0.0.1:8000/appointment-referral-list/", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
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

  // When a referral is selected, fetch the corresponding doctor's schedule
  React.useEffect(() => {
    if (selectedReferral) {
      const token = localStorage.getItem("access");
      setLoadingDoctor(true);
      fetch(`http://127.0.0.1:8000/appointment/doctor-schedule/${selectedReferral.receiving_doctor}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data: Doctor) => {
          setDoctor(data);
          const availabilityData = data.availability || [];
          const slots: Record<string, TimeSlot[]> = {};
          availabilityData.forEach((slot) => {
            const dateKey = slot.date;
            if (!slots[dateKey]) {
              slots[dateKey] = [];
            }
            slots[dateKey].push({
              id: `${dateKey}-${slot.start_time}`,
              start: new Date(`${slot.date}T${slot.start_time}`).toISOString(),
              end: new Date(`${slot.date}T${slot.end_time}`).toISOString(),
              available: slot.is_available,
            });
          });
          setAvailability(slots);
          setLoadingDoctor(false);
        })
        .catch((error) => {
          console.error("Error fetching doctor's schedule:", error);
          setLoadingDoctor(false);
        });
    }
  }, [selectedReferral]);

  const handleSchedule = () => {
    if (!selectedReferral || !selectedSlot || !date) return;
  
    // Find the selected slot object from the availableSlots array.
    const selectedSlotObject = availableSlots.find((slot) => slot.id === selectedSlot);
    if (!selectedSlotObject) return;
  
    setIsScheduling(true);
  
    // Use the base URL without appending the referral id.
    const url = `http://127.0.0.1:8000/appointment/schedule-appointment/`;
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("access")
          ? `Bearer ${localStorage.getItem("access")}`
          : "",
      },
      body: JSON.stringify({
        referral_id: selectedReferral.id, // send the referral ID in the POST body
        appointment_date: selectedSlotObject.start, // ISO datetime string from the selected slot
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // Handle success response
        setIsScheduling(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedReferral(null);
          setSelectedSlot(null);
          setDoctor(null);
          setAvailability({});
        }, 2000);
      })
      .catch((error) => {
        console.error("Error scheduling appointment:", error);
        setIsScheduling(false);
      });
  };
  

  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";
  const availableSlots = selectedDateKey
    ? (availability[selectedDateKey] || []).filter((slot) => slot.available)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Referral Appointment Scheduling</h1>
          <p className="text-gray-600">Select a referral and available time slot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Referrals List */}
          <div className="border-r p-4 h-[600px] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">Pending Referrals</h2>
            <div className="space-y-3">
              {loadingReferrals ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                  </div>
                ))
              ) : referrals.length > 0 ? (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    onClick={() => {
                      setSelectedReferral(referral);
                      setDate(new Date());
                    }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReferral?.id === referral.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">Referral #{referral.id}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {referral.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient ID: {referral.patient}</p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Specialist ID:</span> {referral.receiving_doctor}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reason:</span> {referral.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pending referrals found</p>
              )}
            </div>
          </div>

          {/* Calendar and Scheduling Panel */}
          <div className="col-span-2 p-6">
            {!selectedReferral ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                Please select a referral from the list
              </div>
            ) : (
              <div className="space-y-6">
                {/* Referral Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  {loadingDoctor ? (
                    <div className="space-y-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Patient ID</p>
                        <p>{selectedReferral.patient}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Specialist</p>
                        <p>
                          {doctor
                            ? `${doctor.full_name} - ${doctor.specialization}`
                            : selectedReferral.receiving_doctor}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Reason</p>
                        <p>{selectedReferral.reason}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Notes</p>
                        <p>{selectedReferral.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calendar Component */}
                <div className="border rounded-md p-4">
                  {loadingDoctor ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Skeleton className="h-8 w-48 mb-4" />
                      <div className="grid grid-cols-7 gap-2">
                        {Array(7).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-6 w-6" />
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array(35).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-8" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setSelectedSlot(null);
                      }}
                      className="rounded-md border shadow"
                      disabled={(date) => {
                        const dateKey = format(date, "yyyy-MM-dd");
                        return !availability[dateKey] || availability[dateKey].filter((s) => s.available).length === 0;
                      }}
                    />
                  )}
                </div>

                {/* Time Slots */}
                {date && (
                  <div>
                    <h3 className="font-medium mb-3">
                      Available Slots for {format(date, "MMMM d, yyyy")}
                    </h3>

                    {loadingDoctor ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Array(6).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-gray-500">No available slots for this date</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableSlots.map((slot) => {
                          const slotStart = parseISO(slot.start);
                          const slotEnd = parseISO(slot.end);
                          const isPast = isBefore(slotEnd, new Date());

                          return (
                            <button
                              key={slot.id}
                              onClick={() => !isPast && setSelectedSlot(slot.id)}
                              disabled={isPast}
                              className={`p-3 border rounded-lg text-center ${
                                selectedSlot === slot.id
                                  ? "bg-blue-100 border-blue-500"
                                  : isPast
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="font-medium">
                                {format(slotStart, "h:mm a")} - {format(slotEnd, "h:mm a")}
                              </div>
                              {isPast && <div className="text-xs text-red-500 mt-1">Passed</div>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedReferral(null);
                      setSelectedSlot(null);
                      setDoctor(null);
                      setAvailability({});
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedSlot || isScheduling}
                    className={`px-4 py-2 rounded-md text-white ${
                      isScheduling ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Appointment"}
                  </button>
                </div>

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded">
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