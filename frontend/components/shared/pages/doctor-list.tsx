"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Schedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface DoctorProfile {
  specialization: string;
  schedules: Schedule[];
}

interface APIDoctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  doctor_profile: DoctorProfile;
}

// --- Extended doctor type for UI purposes ---
interface ExtendedDoctorCardProps {
  id: string;
  email: string;
  name: string;
  qualifications: string;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  feedbackCount: number;
  price: string;
  availability: string;
  specialties: string[];
  schedules: Schedule[];
  imageUrl?: string;
}

// --- DoctorCard Component ---
interface DoctorCardComponentProps extends ExtendedDoctorCardProps {
  onEdit?: () => void;
  onArchive?: () => void;
}

const DoctorCard: React.FC<DoctorCardComponentProps> = ({
  name,
  qualifications,
  rating,
  reviewCount,
  description,
  address,
  feedbackCount,
  price,
  availability,
  specialties,
  imageUrl,
  onEdit,
  onArchive,
}) => {
  const [expanded, setExpanded] = useState(false);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ★
        </span>
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div
      className={`flex flex-col border rounded-lg overflow-hidden shadow-md mb-6 transition-all duration-300 hover:shadow-lg ${
        expanded ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Doctor Info Section */}
        <div className="p-6 md:w-3/4">
          <div className="flex items-start">
            <div className="mr-4 h-16 w-16 flex-shrink-0 rounded-full bg-gray-200">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-500">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-blue-800">{name}</h2>
              <p className="mb-2 text-sm text-gray-600">{qualifications}</p>
              <div className="mb-3 flex items-center">
                <span className="mr-1 font-medium">{rating.toFixed(1)}</span>
                <div className="mr-2 text-sm">{renderStars()}</div>
                <span className="text-sm text-gray-500">
                  ({reviewCount.toLocaleString()} ratings)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {specialties.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-700">
              {expanded ? description : `${description.substring(0, 100)}...`}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </div>
        </div>
        {/* Clinic Info Section */}
        <div className="flex flex-col justify-between border-t border-gray-200 bg-gray-50 p-6 md:w-1/4 md:border-l md:border-t-0">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-700">{address}</p>
              <p className="mt-1 text-sm text-gray-500">
                {feedbackCount} Feedbacks
              </p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-green-700">{price}</p>
            </div>
            <div>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {availability}
              </p>
            </div>
          </div>

          {/* Conditionally show Edit/Archive buttons if callbacks are provided */}
          {onEdit && onArchive && (
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onEdit}
                className="rounded bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-yellow-600"
              >
                Edit
              </button>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600">
                    Archive
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Archive</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to archive this doctor? Archived
                      doctors will be moved to the archive section.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.dispatchEvent(
                          new KeyboardEvent("keydown", { key: "Escape" })
                        )
                      }
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={onArchive}>
                      Confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Data structure for add/edit doctor forms ---
interface NewDoctorData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirm_password?: string;
  specialization: string;
  schedules: Schedule[];
}

// --- Main DoctorsPage Component ---
const DoctorsPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isGeneralDoctor, setIsGeneralDoctor] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/user/users/current-email/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch user email");
          return;
        }

        const data = await response.json();
        setUserEmail(data.email);

        // Check if user is General Doctor
        const isGenDoc =
          userEmail.toLowerCase() === "generaldoctor@hospital.com";
        setIsGeneralDoctor(isGenDoc);
        console.log("User is General Doctor:", isGenDoc);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [doctors, setDoctors] = useState<ExtendedDoctorCardProps[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<{
    id: string;
    data: NewDoctorData;
  } | null>(null);
  const [newDoctor, setNewDoctor] = useState<NewDoctorData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    specialization: "",
    schedules: [],
  });

  const specialties = [
    "All",
    "Cardiologist",
    "General Doctor",
    "ENT",
    "Pediatrics",
  ];

  // --- Fetch Doctors from API ---
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/?role=doctor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data: APIDoctor[] = await response.json();
      const mappedDoctors = data.map((doc) => {
        const name = `${doc.first_name} ${doc.last_name}`;
        const qualifications =
          doc.doctor_profile.specialization || "Not specified";
        const rating = 5;
        const reviewCount = 0;
        const description = "No description provided.";
        const address = "Address not available";
        const feedbackCount = 0;
        const price = "Free Consultation";
        const availability =
          doc.doctor_profile.schedules &&
          doc.doctor_profile.schedules.length > 0
            ? doc.doctor_profile.schedules
                .map(
                  (schedule) =>
                    `${schedule.day_of_week}: ${schedule.start_time.substring(
                      0,
                      5
                    )} - ${schedule.end_time.substring(0, 5)}`
                )
                .join("\n")
            : "Not available";
        const mappedSpecialties = [doc.doctor_profile.specialization];
        return {
          id: doc.id,
          email: doc.email,
          name,
          qualifications,
          rating,
          reviewCount,
          description,
          address,
          feedbackCount,
          price,
          availability,
          specialties: mappedSpecialties,
          schedules: doc.doctor_profile.schedules,
          imageUrl: undefined,
        };
      });
      setDoctors(mappedDoctors);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // --- Handlers for Add and Edit Form Changes ---
  const handleDoctorChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: "add" | "edit"
  ) => {
    const { name, value } = e.target;
    if (formType === "add") {
      setNewDoctor((prev) => ({ ...prev, [name]: value }));
    } else if (formType === "edit" && currentDoctor) {
      setCurrentDoctor((prev) =>
        prev ? { id: prev.id, data: { ...prev.data, [name]: value } } : null
      );
    }
  };

  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: string,
    formType: "add" | "edit"
  ) => {
    if (formType === "add") {
      setNewDoctor((prev) => {
        const schedules = [...prev.schedules];
        schedules[index] = { ...schedules[index], [field]: value };
        return { ...prev, schedules };
      });
    } else if (formType === "edit" && currentDoctor) {
      setCurrentDoctor((prev) => {
        if (!prev) return prev;
        const schedules = [...prev.data.schedules];
        schedules[index] = { ...schedules[index], [field]: value };
        return { id: prev.id, data: { ...prev.data, schedules } };
      });
    }
  };

  const addNewSchedule = (formType: "add" | "edit") => {
    if (formType === "add") {
      setNewDoctor((prev) => ({
        ...prev,
        schedules: [
          ...prev.schedules,
          { day_of_week: "Monday", start_time: "09:00", end_time: "17:00" },
        ],
      }));
    } else if (formType === "edit" && currentDoctor) {
      setCurrentDoctor((prev) =>
        prev
          ? {
              id: prev.id,
              data: {
                ...prev.data,
                schedules: [
                  ...prev.data.schedules,
                  {
                    day_of_week: "Monday",
                    start_time: "09:00",
                    end_time: "17:00",
                  },
                ],
              },
            }
          : null
      );
    }
  };

  // --- Add Doctor Submission ---
  const handleAddDoctor = async (e: FormEvent) => {
    e.preventDefault();
    if (newDoctor.password !== newDoctor.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("access");
      const payload = {
        email: newDoctor.email,
        first_name: newDoctor.first_name,
        last_name: newDoctor.last_name,
        password: newDoctor.password,
        re_password: newDoctor.confirm_password,
        role: "doctor",
        doctor_profile: {
          specialization: newDoctor.specialization,
          schedules: newDoctor.schedules,
        },
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      setIsAddModalOpen(false);
      setNewDoctor({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        specialization: "",
        schedules: [],
      });
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to add doctor");
    }
  };

  // --- Edit Doctor Submission ---
  const handleEditDoctor = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentDoctor) return;
    try {
      const token = localStorage.getItem("access");
      const payload = {
        email: currentDoctor.data.email,
        first_name: currentDoctor.data.first_name,
        last_name: currentDoctor.data.last_name,
        role: "doctor",
        doctor_profile: {
          specialization: currentDoctor.data.specialization,
          schedules: currentDoctor.data.schedules,
        },
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/${currentDoctor.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      setIsEditModalOpen(false);
      setCurrentDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to edit doctor");
    }
  };

  const handleArchiveDoctor = async (doctorId: string) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/${doctorId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to archive doctor");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to archive doctor");
    }
  };

  // --- Prepare Edit Modal ---
  const openEditModal = (doctor: ExtendedDoctorCardProps) => {
    const nameParts = doctor.name.split(" ");
    setCurrentDoctor({
      id: doctor.id,
      data: {
        first_name: nameParts[0] || "",
        last_name: nameParts[1] || "",
        email: doctor.email,
        specialization: doctor.qualifications,
        schedules: doctor.schedules,
      },
    });
    setIsEditModalOpen(true);
  };

  // --- Filtering and Sorting ---
  const filteredDoctors = doctors
    .filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (doctor) =>
        selectedSpecialty === "All" ||
        doctor.specialties.some((s) => s.includes(selectedSpecialty))
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price")
        return (
          parseInt(a.price.replace(/\D/g, "")) -
          parseInt(b.price.replace(/\D/g, ""))
        );
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });

  const handleArchivesClick = () => {
    router.push("/doctor/archives");
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="flex-1 text-3xl font-bold text-blue-800">
          Find Doctors
        </h1>

        {/* Archives Button (only for General Doctor) */}
        {isGeneralDoctor && (
          <button
            onClick={handleArchivesClick}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Archives
          </button>
        )}

        {/* Add Doctor Button (only for General Doctor) */}
        {isGeneralDoctor && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Add Doctor
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Doctor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="mt-4 space-y-4">
                {/* Form fields for adding a doctor */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={newDoctor.first_name}
                      onChange={(e) => handleDoctorChange(e, "add")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={newDoctor.last_name}
                      onChange={(e) => handleDoctorChange(e, "add")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newDoctor.email}
                    onChange={(e) => handleDoctorChange(e, "add")}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newDoctor.password}
                      onChange={(e) => handleDoctorChange(e, "add")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={newDoctor.confirm_password}
                      onChange={(e) => handleDoctorChange(e, "add")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={(e) => handleDoctorChange(e, "add")}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      Schedules
                    </label>
                    <button
                      type="button"
                      onClick={() => addNewSchedule("add")}
                      className="rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
                    >
                      Add Schedule
                    </button>
                  </div>
                  {newDoctor.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 items-center gap-2"
                    >
                      <select
                        value={schedule.day_of_week}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "day_of_week",
                            e.target.value,
                            "add"
                          )
                        }
                        className="rounded border p-2"
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "start_time",
                            e.target.value,
                            "add"
                          )
                        }
                        className="rounded border p-2"
                        required
                      />
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "end_time",
                            e.target.value,
                            "add"
                          )
                        }
                        className="rounded border p-2"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Add Doctor
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Doctor Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <span />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
            </DialogHeader>
            {currentDoctor && (
              <form onSubmit={handleEditDoctor} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={currentDoctor.data.first_name}
                      onChange={(e) => handleDoctorChange(e, "edit")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={currentDoctor.data.last_name}
                      onChange={(e) => handleDoctorChange(e, "edit")}
                      className="w-full rounded border p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={currentDoctor.data.email}
                    onChange={(e) => handleDoctorChange(e, "edit")}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={currentDoctor.data.specialization}
                    onChange={(e) => handleDoctorChange(e, "edit")}
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      Schedules
                    </label>
                    <button
                      type="button"
                      onClick={() => addNewSchedule("edit")}
                      className="rounded bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700"
                    >
                      Add Schedule
                    </button>
                  </div>
                  {currentDoctor.data.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 items-center gap-2"
                    >
                      <select
                        value={schedule.day_of_week}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "day_of_week",
                            e.target.value,
                            "edit"
                          )
                        }
                        className="rounded border p-2"
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "start_time",
                            e.target.value,
                            "edit"
                          )
                        }
                        className="rounded border p-2"
                        required
                      />
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "end_time",
                            e.target.value,
                            "edit"
                          )
                        }
                        className="rounded border p-2"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setCurrentDoctor(null);
                    }}
                    className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or qualification"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="price">Price (Low to High)</option>
              <option value="reviews">Number of Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredDoctors.length} doctors
      </p>

      {/* Render Doctor Cards */}
      <div className="space-y-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            {...doctor}
            onEdit={isGeneralDoctor ? () => openEditModal(doctor) : undefined}
            onArchive={
              isGeneralDoctor ? () => handleArchiveDoctor(doctor.id) : undefined
            }
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">
            No doctors found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("All");
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
