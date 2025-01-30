"use client";

import { useState } from 'react';
export default function Page() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    complaint: 'general_illness',
    street_address: '',
    barangay: '',
    municipal_city: '',
    agree_terms: false,
  });
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const checked = (event.target as HTMLInputElement).checked;
  console.log(checked);
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make the API request to the backend (Assuming the backend endpoint is /api/patient-register/)
    const response = await fetch('/api/patient-register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Patient registered:', result);
      // Optionally, show success or navigate elsewhere
    } else {
      console.error('Error registering patient');
      // Optionally, handle error or show error message
    }
  };

  return (
    <div className="flex-1 px-4 pt-32 sm:px-6 lg:px-8">
      <form className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" id="first_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="John" required />
          </div>
          <div>
            <label htmlFor="middle_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Middle name</label>
            <input type="text" id="middle_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Michael" />
          </div>
          <div>
            <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input type="text" id="last_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Doe" required />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
            <input type="tel" id="phone"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Enter your number" pattern="" required />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Email address</label>
          <input type="email" id="email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="john.doe@company.com" required />
        </div>
        
        <div className="mb-6">
          <label htmlFor="date_of_birth" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
          <input type="date" id="date_of_birth"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required />
        </div>
        
        <div className="mb-6">
          <label htmlFor="complaint" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Complaint</label>
          <select id="complaint"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
            <option value="general_illness">General Illness</option>
            <option value="injury">Injury</option>
            <option value="checkup">Check-up</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="street_address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Street Address</label>
            <input type="text" id="street_address"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="123 Main St" />
          </div>
          <div>
            <label htmlFor="barangay" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Barangay</label>
            <input type="text" id="barangay"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Barangay 1" />
          </div>
          <div>
            <label htmlFor="municipal_city" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Municipal/City</label>
            <input type="text" id="municipal_city"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="City Name" />
          </div>
        </div>

        <div className="mb-6 flex items-start">
          <div className="flex h-5 items-center">
            <input id="remember" type="checkbox" value=""
              className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              required />
          </div>
          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a
            href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
        </div>
        
        <button type="submit"
          className="w-full rounded-lg bg-sky-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300">Submit</button>
      </form>
    </div>
  );
}
