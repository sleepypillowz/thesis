"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
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
  onDelete?: () => void;
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
  onDelete,
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
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex-shrink-0">
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
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-blue-800">{name}</h2>
              <p className="text-gray-600 text-sm mb-2">{qualifications}</p>
              <div className="flex items-center mb-3">
                <span className="font-medium mr-1">
                  {rating.toFixed(1)}
                </span>
                <div className="text-sm mr-2">{renderStars()}</div>
                <span className="text-gray-500 text-sm">
                  ({reviewCount.toLocaleString()} ratings)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-700 text-sm">
              {expanded
                ? description
                : `${description.substring(0, 100)}...`}
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-sm mt-2 hover:underline focus:outline-none"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </div>
        </div>
        {/* Clinic Info Section */}
        <div className="bg-gray-50 p-6 md:w-1/4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
          <div>
            <div className="mb-4">
              <p className="text-gray-700 text-sm">{address}</p>
              <p className="text-gray-500 text-sm mt-1">
                {feedbackCount} Feedbacks
              </p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-green-700">{price}</p>
            </div>
            <div>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {availability}
              </p>
            </div>
          </div>
          {/* Edit & Delete Actions (conditionally rendered) */}
          {onEdit && onDelete && (
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onEdit}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
              >
                Delete
              </button>
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
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('access'); // Retrieve token from localStorage
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('http://localhost:8000/user/users/current-email/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user email');
          return;
        }

        const data = await response.json();
        setUserEmail(data.email);
        console.log('Retrieved userEmail:', data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);
  

  const isGeneralDoctor = userEmail.toLowerCase() === 'generaldoctor@hospital.com'; // or another admin email check

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [doctors, setDoctors] = useState<ExtendedDoctorCardProps[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // currentDoctor holds the id and prefilled data for editing.
  const [currentDoctor, setCurrentDoctor] = useState<
    { id: string; data: NewDoctorData } | null
  >(null);

  // For the add form.
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
    "Dermatology",
    "Dentistry",
    "General Doctor",
    "ENT",
    "Pediatrics",
  ];

  // --- Fetch Doctors from API ---
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "http://127.0.0.1:8000/user/users/?role=doctor",
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
                  { day_of_week: "Monday", start_time: "09:00", end_time: "17:00" },
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
      const response = await fetch("http://127.0.0.1:8000/user/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
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
        `http://127.0.0.1:8000/user/users/${currentDoctor.id}/`,
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

  // --- Delete Doctor ---
  const handleDeleteDoctor = async (doctorId: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `http://127.0.0.1:8000/user/users/${doctorId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete doctor");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor");
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

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Find Doctors</h1>
        {isGeneralDoctor && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Doctor
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Doctor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="space-y-4 mt-4">
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      Schedules
                    </label>
                    <button
                      type="button"
                      onClick={() => addNewSchedule("add")}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Add Schedule
                    </button>
                  </div>
                  {newDoctor.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 items-center"
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
                        className="p-2 border rounded"
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
                        className="p-2 border rounded"
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
                        className="p-2 border rounded"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
              <form onSubmit={handleEditDoctor} className="space-y-4 mt-4">
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
                      className="w-full p-2 border rounded"
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
                      className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
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
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                      Schedules
                    </label>
                    <button
                      type="button"
                      onClick={() => addNewSchedule("edit")}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Add Schedule
                    </button>
                  </div>
                  {currentDoctor.data.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 items-center"
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
                        className="p-2 border rounded"
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
                        className="p-2 border rounded"
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
                        className="p-2 border rounded"
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
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or qualification"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="price">Price (Low to High)</option>
              <option value="reviews">Number of Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredDoctors.length} doctors
      </p>

      {/* Render Doctor Cards */}
      <div className="space-y-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            {...doctor}
            onEdit={isGeneralDoctor ? () => openEditModal(doctor) : undefined}
            onDelete={isGeneralDoctor ? () => handleDeleteDoctor(doctor.id) : undefined}
          />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
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
