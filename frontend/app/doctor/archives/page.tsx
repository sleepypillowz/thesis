'use client'
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
  is_active: boolean;
}

export default function ArchivedDoctors() {
  const [archivedDoctors, setArchivedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [restoreLoading, setRestoreLoading] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchArchivedDoctors = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/users/archived/?role=doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || 'Failed to fetch archived doctors');
      }
      
      const data = await response.json();
      setArchivedDoctors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (doctorId: string) => {
    if (!confirm('Are you sure you want to restore this doctor?')) return;
    
    setRestoreLoading(prev => ({ ...prev, [doctorId]: true }));
  
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/${doctorId}/restore/`,  // Keep existing URL structure
        {
          method: 'PATCH',  // Must match backend method
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }
  
      await fetchArchivedDoctors();
      setSuccessMessage('Doctor restored successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setErrorMessage(errorMessage);
      console.error('Restore error:', err);
    } finally {
      setRestoreLoading(prev => ({ ...prev, [doctorId]: false }));
    }
  };

  useEffect(() => {
    fetchArchivedDoctors();
  }, []);

  // Loading state
  if (loading) return <div className="p-4">Loading archived doctors...</div>;

  // Error state
  if (error) return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-lg">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Archived Doctors</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-900 rounded-lg p-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-4">
          {errorMessage}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {archivedDoctors?.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{`${doctor.first_name} ${doctor.last_name}`}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.role}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRestore(doctor.id)}
                  variant="outline"
                  className={`transition-colors ${
                    restoreLoading?.[doctor.id]
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  disabled={restoreLoading?.[doctor.id]}
                >
                  {restoreLoading?.[doctor.id] ? 'Restoring...' : 'Restore'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}