"use client";

import React, { useState, useEffect } from "react";
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
          {/* Edit & Delete Actions (conditionally rendered) */}
          {onEdit && onDelete && (
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
                    Delete
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this item? Deleted data
                      goes to Archive and it will be deleted within 30 days.
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
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onDelete();
                        document.dispatchEvent(
                          new KeyboardEvent("keydown", { key: "Escape" })
                        );
                      }}
                    >
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

// --- Main DoctorsPage Component ---
const DoctorsPage: React.FC = () => {
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem("access"); // Retrieve token from localStorage
        if (!token) {
          console.error("No access token found");
          return;
        }

        const response = await fetch(
          "http://localhost:8000/user/users/current-email/",
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
        console.log("Retrieved userEmail:", data.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [doctors, setDoctors] = useState<ExtendedDoctorCardProps[]>([]);
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
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="flex-1 text-3xl font-bold text-blue-800">
          Find Doctors
        </h1>
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
          <DoctorCard key={doctor.id} {...doctor} />
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
