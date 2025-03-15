'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Pill, ChevronLeft, Calendar, ChevronRight } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Medicine {
  id: number;
  name: string;
  category: string;
  dosage_form: string;
  strength: string;
  manufacturer: string;
  indication: string;
  classification: string;
  stocks: number;
  expiration_date: string
}

export default function MedicineList() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;
  useEffect(() => {
    const token = localStorage.getItem('access');
    
    setIsLoading(true);
    fetch('http://127.0.0.1:8000/medicine/medicines', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return response.json();
    })
    .then(data => {
      setMedicines(data);
      setFilteredMedicines(data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching medicines:', error);
      setError('Failed to load medicines. Please try again later.');
      setIsLoading(false);
    });
  }, []);
  
  useEffect(() => {
    // Filter medicines based on search term and category
    const results = medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || medicine.category === categoryFilter)
    );
    setFilteredMedicines(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, medicines]);
  
  // Get unique categories for filter dropdown
  const categories = [...new Set(medicines.map(medicine => medicine.category))];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + rowsPerPage);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medicines Management</h1>
        <Button className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow-md transition duration-300">
          <Link href="/medical-secretary/manage-medicines">
            View Prescribed Medicines
          </Link>
        </Button>
      </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search medicines..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + rowsPerPage, filteredMedicines.length)}
            </span>{" "}
            of <span className="font-medium">{filteredMedicines.length}</span> medicines
          </p>
        </div>
      </div>

            {filteredMedicines.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">No medicines found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMedicines.map((medicine) => (
        <div
          key={medicine.id}
          className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Stock Badge On Upper-Right */}
          <div
              className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-md shadow-sm ${
                medicine.stocks >= 200
                ? "bg-green-100 text-green-600" // ✅ In Stock
                : medicine.stocks > 100
                ? "bg-orange-100 text-orange-600" // ⚠️ Low Stock
                : medicine.stocks > 0
                ? "bg-rose-100 text-rose-600" // 🔥 Almost Out of Stock (Reddish)
                : "bg-red-100 text-red-600" // ❌ Out of Stock
            }`}
          >
            {medicine.stocks >= 200
              ? `In Stock (${medicine.stocks})`
              : medicine.stocks > 100
              ? `Low Stock (${medicine.stocks})`
              : medicine.stocks > 0
              ? `Almost Out of Stock (${medicine.stocks})`
              : `Out of Stock`}
          </div>

          <div className="p-5">
            {/* Medicine Name */}
            <div className="flex items-center mb-3">
              <Pill className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {medicine.name}
              </h2>
            </div>

            {/* Category */}
            <div className="bg-blue-50 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded inline-block mb-3">
              {medicine.category}
            </div>

            {/* Medicine Details */}
            <div className="space-y-2 text-sm text-gray-700">
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-gray-500">Dosage Form:</span>
                <span className="col-span-2">{medicine.dosage_form}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-gray-500">Strength:</span>
                <span className="col-span-2">{medicine.strength}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-gray-500">Manufacturer:</span>
                <span className="col-span-2">{medicine.manufacturer}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-gray-500">Classification:</span>
                <span className="col-span-2">{medicine.classification}</span>
              </div>

              {/* Expiration Date */}
              <div className="grid grid-cols-3 gap-1">
                <span className="font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" /> Expiry:
                </span>
                <span className="col-span-2">
                  {new Date(medicine.expiration_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Indication */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Indication:
              </h3>
              <p className="text-gray-700 text-sm line-clamp-2">
                {medicine.indication}
              </p>
            </div>
          </div>
        </div>
      ))}
          </div>
          
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages || 1}</span>
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}