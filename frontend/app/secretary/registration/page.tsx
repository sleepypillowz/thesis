"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    gender: "Male",
    complaint: "General Illness",
    other_complaint: "",
    priority_level: "Regular",
    street_address: "",
    barangay: "",
    municipal_city: "",
    agree_terms: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/patient/patient-register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          gender: "Male",
          complaint: "General Illness",
          other_complaint: "",
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

  const toggleTermsModal = () => setShowTermsModal(!showTermsModal);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Registration</h1>
          <Button>
            <Link href="/secretary/old-patient/old-patient-registration">
              Existing Patient
            </Link>
          </Button>
        </div>

        <div className="card overflow-hidden p-0">
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
              <h3 className="mb-4 text-base font-semibold">
                Personal Information
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-medium"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="middle_name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Middle Name
                  </label>
                  <Input
                    type="text"
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label
                      htmlFor="date_of_birth"
                      className="mb-2 block text-sm font-medium"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      id="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-sm font-medium"
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="card block w-full rounded-lg p-3 text-sm"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone_number"
                    className="mb-2 block text-sm font-medium"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g., 09123456789"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold">
                Address Information
              </h3>
              <div className="">
                <div className="md:col-span-3">
                  <label
                    htmlFor="street_address"
                    className="mb-2 block text-sm font-medium"
                  >
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    placeholder="House/Building No., Street Name"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <div className="w-full">
                  <label
                    htmlFor="barangay"
                    className="mb-2 block text-sm font-medium"
                  >
                    Barangay <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    placeholder="Enter barangay"
                    className="w-full"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="municipal_city"
                    className="mb-2 block text-sm font-medium"
                  >
                    Municipal/City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="municipal_city"
                    value={formData.municipal_city}
                    onChange={handleChange}
                    placeholder="Enter municipal/city"
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold">
                Medical Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="complaint"
                    className="mb-2 block text-sm font-medium"
                  >
                    Type of Complaint <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="complaint"
                    value={formData.complaint}
                    onChange={handleChange}
                    className="card block w-full rounded-lg p-3 text-sm"
                    required
                  >
                    <option value="General Illness">General Illness</option>
                    <option value="Injury">Injury</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {formData.complaint === "Other" && (
                  <div>
                    <label
                      htmlFor="other_complaint"
                      className="mb-2 block text-sm font-medium"
                    >
                      Please specify <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="other_complaint"
                      value={formData.other_complaint}
                      onChange={handleChange}
                      placeholder="Enter your reason"
                      required
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="priority_level"
                    className="mb-2 block text-sm font-medium"
                  >
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority_level"
                    value={formData.priority_level}
                    onChange={handleChange}
                    className="card block w-full rounded-lg p-3 text-sm"
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
            <div className="mb-8 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Input
                    id="agree_terms"
                    type="checkbox"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agree_terms" className="font-medium">
                    <span
                      onClick={toggleTermsModal}
                      className="cursor-pointer hover:text-blue-700 hover:underline"
                    >
                      I agree to the terms and conditions
                    </span>{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-xs">
                    By agreeing, you consent to the collection and processing of
                    your personal information for medical purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Patient"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="card w-full max-w-md rounded-lg p-6 shadow-xl">
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
            <h2 className="mb-2 text-xl font-bold">Registration Successful</h2>
            <p className="mb-6 text-sm">
              The patient has been successfully registered in the system.
            </p>
            <div className="flex justify-between space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full border border-blue-900 text-blue-900"
              >
                Add New Patient
              </Button>
              <Button
                onClick={() => router.push("/secretary/registration-queue")}
                className="w-full"
              >
                View Queue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="card w-full max-w-2xl rounded-lg p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Terms and Conditions</h2>
              <button
                onClick={toggleTermsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="prose max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold">Patient Agreement</h3>
              <p className="text-sm">
                By registering with our healthcare facility, you agree to the
                following terms:
              </p>

              <ol className="mt-4 list-decimal pl-6 text-sm">
                <li className="mb-3">
                  <strong>Accuracy of Information:</strong> You certify that all
                  provided personal and medical information is complete and
                  accurate to the best of your knowledge.
                </li>
                <li className="mb-3">
                  <strong>Privacy Consent:</strong> You consent to the
                  collection, use, and disclosure of your personal health
                  information for the purposes of treatment, payment, and
                  healthcare operations.
                </li>
                <li className="mb-3">
                  <strong>Financial Responsibility:</strong> You understand and
                  agree to be financially responsible for any services received.
                </li>
                <li className="mb-3">
                  <strong>Treatment Consent:</strong> You consent to medical
                  treatment deemed necessary by healthcare providers,
                  understanding that all procedures carry inherent risks.
                </li>
                <li className="mb-3">
                  <strong>Communication:</strong> You agree to receive
                  communications regarding your care via the contact information
                  provided.
                </li>
              </ol>

              <p className="mt-4 text-xs text-gray-600">
                This agreement is effective upon registration and remains valid
                throughout your care at this facility. You may request a full
                copy of our privacy policy at any time.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={toggleTermsModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
