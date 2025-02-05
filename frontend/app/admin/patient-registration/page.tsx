"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    date_of_birth: "",
    complaint: "general_illness",
    priority: "Regular", // Move this directly to formData
    street_address: "",
    barangay: "",
    municipal_city: "",
    agree_terms: false,
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = event.target;
    
    // Type narrowing for checkbox
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: (event.target as HTMLInputElement).checked, // Safely access checked
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
  
    console.log("Form Data being sent:", formData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/patient/patient-register/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const responseBody = await response.json();
      console.log("Response Body:", responseBody);
      
      if (response.ok) {
        // Reset form data including priority and complaint directly
        // setFormData({
        //   first_name: "",
        //   middle_name: "",
        //   last_name: "",
        //   phone_number: "",
        //   email: "",
        //   date_of_birth: "",
        //   complaint: "general_illness",
        //   priority: "Regular", // Reset priority here directly
        //   street_address: "",
        //   barangay: "",
        //   municipal_city: "",
        //   agree_terms: false,
        // });
        setShowModal(true);  // Show the popup
      }
  
      console.log("Patient registered:", responseBody);
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <div className="flex-1 px-4 pt-32 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              First name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label htmlFor="middle_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Middle name
            </label>
            <input
              type="text"
              id="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Michael"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Last name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Phone number
            </label>
            <input
              type="tel"
              id="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your number"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="john.doe@company.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="date_of_birth" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Address Fields */}
        <div className="mb-6">
          <label htmlFor="street_address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Street Address
          </label>
          <input
            type="text"
            id="street_address"
            value={formData.street_address}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="123 Main St"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="barangay" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Barangay
          </label>
          <input
            type="text"
            id="barangay"
            value={formData.barangay}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Barangay Name"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="municipal_city" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Municipal/City
          </label>
          <input
            type="text"
            id="municipal_city"
            value={formData.municipal_city}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="City Name"
            required
          />
        </div>

        {/* Complaint Choice */}
        <div className="mb-6">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Type of Complaint
          </label>
          <select
            id="complaint"
            value={formData.complaint}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="general_illness">General Illness</option>
            <option value="injury">Injury</option>
            <option value="checkup">Check-up</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority Choice */}
        <div className="mb-6">
          <label htmlFor="priority" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
          >
          <option value="Regular">Regular</option>
          <option value="Priority">Priority Lane (PWD/Pregnant)</option>

          </select>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6 flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="agree_terms"
              type="checkbox"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="focus:ring-3 h-4 w-4 rounded border-gray-300 text-blue-600 ring-offset-gray-100"
              required
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="agree_terms" className="font-medium text-gray-900 dark:text-white">
              I agree to the terms and conditions
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 p-2.5 text-center text-sm font-medium text-white focus:outline-none hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/3 bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Patient Registered Successfully!</h2>
            <div className="mt-4 flex justify-around">
              <button
                className="text-blue-500"
                onClick={() => {
                  setShowModal(false);
                  //setFormData({ ...formData, priority: "Regular" });  // reset priority explicitly
                }}
              >
                Add New Patient
              </button>
              <button
                className="text-blue-500"
                onClick={() => router.push('/admin/registration-queue')}
              >
                Go to Registration Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
