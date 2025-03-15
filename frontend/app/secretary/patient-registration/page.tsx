"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import userInfo from "@/components/hooks/userRole";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    complaint: "General Illness",
    priority_level: "Regular",
    street_address: "",
    barangay: "",
    municipal_city: "",
    agree_terms: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Handle input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = event.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: (event.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("access");

      const response = await fetch(
        "http://127.0.0.1:8000/patient/patient-register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const responseBody = await response.json();
        console.log("Response Body:", responseBody);

        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          phone_number: "",
          email: "",
          date_of_birth: "",
          complaint: "General Illness",
          priority_level: "Regular",
          street_address: "",
          barangay: "",
          municipal_city: "",
          agree_terms: false,
        });
        setShowModal(true);
      } else {
        const errorBody = await response.text();
        console.error("Registration failed:", errorBody);
      }
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Registration
          </h1>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/secretary/old-patient/old-patient-registration">
              Existing Patient
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
            <h2 className="text-lg font-medium text-blue-800">
              New Patient Information
            </h2>
            <p className="mt-1 text-sm text-blue-600">
              Please fill in all required fields marked with *
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold text-gray-700">
                Personal Information
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="middle_name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="date_of_birth"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone_number"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="e.g., 09123456789"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold text-gray-700">
                Address Information
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label
                    htmlFor="street_address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="House/Building No., Street Name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="barangay"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Barangay <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="Enter barangay"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="municipal_city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Municipal/City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="municipal_city"
                    value={formData.municipal_city}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    placeholder="Enter municipal/city"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold text-gray-700">
                Medical Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="complaint"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Type of Complaint <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="complaint"
                    value={formData.complaint}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    required
                  >
                    <option value="General Illness">General Illness</option>
                    <option value="Injury">Injury</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="priority_level"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority_level"
                    value={formData.priority_level}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                    required
                  >
                    <option value="Regular">Regular</option>
                    <option value="Priority">
                      Priority Lane (PWD/Pregnant/Senior Citizen)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8 rounded-lg bg-gray-50 p-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="agree_terms"
                    type="checkbox"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="agree_terms"
                    className="font-medium text-gray-700"
                  >
                    I agree to the terms and conditions{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    By agreeing, you consent to the collection and processing of
                    your personal information for medical purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Registration Successful
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              The patient has been successfully registered in the system.
            </p>
            <div className="flex justify-between space-x-4">
              <button
                className="w-full rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setShowModal(false)}
              >
                Add New Patient
              </button>
              <button
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() =>
                  router.push("/secretary/patient-registration-queue")
                }
              >
                View Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
