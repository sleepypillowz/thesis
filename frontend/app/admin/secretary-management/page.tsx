'use client';
import { useEffect, useState } from 'react';

interface Secretary {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export default function SecretariesTable() {
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Secretary | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSecretary, setEditingSecretary] = useState<Secretary | null>(null);
  const [formData, setFormData] = useState<Partial<Secretary>>({});

  const fetchSecretaries = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/users/?role=secretary`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch secretaries');
      const data = await response.json();
      setSecretaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load secretaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const handleEdit = (secretary: Secretary) => {
    setEditingSecretary(secretary);
    setFormData(secretary);
    setIsModalOpen(true);
  };

  const handleDelete = async (secretaryId: string) => {
    if (window.confirm('Are you sure you want to delete this secretary?')) {
      try {
        const accessToken = localStorage.getItem("access");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/secretaries/${secretaryId}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete secretary');
        await fetchSecretaries();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete secretary');
      }
    }
  };

  const handleSave = async () => {
    if (!editingSecretary) return;

    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/secretaries/${editingSecretary.id}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update secretary');
      await fetchSecretaries();
      setIsModalOpen(false);
      setEditingSecretary(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update secretary');
    }
  };
  
  // Search filter function
  const filteredSecretaries = secretaries.filter(secretary => 
    secretary.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secretary.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secretary.email.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Sort function
  const sortedSecretaries = [...filteredSecretaries].sort((a, b) => {
    if (!sortBy) return 0;
    
    let valA, valB;
    
    if (sortBy === 'date_joined') {
      valA = new Date(a[sortBy]).getTime();
      valB = new Date(b[sortBy]).getTime();
    } else {
      valA = a[sortBy].toLowerCase();
      valB = b[sortBy].toLowerCase();
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (column: keyof Secretary) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Custom spinner instead of NextUI spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
          <div className="mt-16 text-center text-gray-600">Loading secretaries...</div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold leading-6 text-gray-900">
            Secretaries Directory
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all registered secretaries
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Search secretaries by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-4 mb-2 text-sm text-gray-500">
        {filteredSecretaries.length} secretaries found
      </div>

      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100" 
                      onClick={() => handleSort('last_name')}
                    >
                      <div className="flex items-center">
                        Name
                        {sortBy === 'last_name' && (
                          <span className="ml-2">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortBy === 'email' && (
                          <span className="ml-2">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date_joined')}
                    >
                      <div className="flex items-center">
                        Registration Date
                        {sortBy === 'date_joined' && (
                          <span className="ml-2">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedSecretaries.length > 0 ? (
                    sortedSecretaries.map((secretary) => (
                      <tr key={secretary.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {`${secretary.first_name} ${secretary.last_name}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {secretary.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(secretary.date_joined).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(secretary)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(secretary.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No secretaries found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isModalOpen && editingSecretary && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-semibold mb-4">Edit Secretary</h2>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              value={formData.first_name || ''}
                              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              value={formData.last_name || ''}
                              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>

                          <div className="flex justify-end space-x-4">
                            <button
                              type="button"
                              onClick={() => {
                                setIsModalOpen(false);
                                setEditingSecretary(null);
                              }}
                              className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
