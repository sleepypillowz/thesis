"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  doctor_profile?: {
    specialization: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  
  // Fetch full user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/user/users/current-profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/user/users/update-me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: user?.first_name,
          last_name: user?.last_name,
          doctor_profile: user?.doctor_profile
        }),
      });
  
      if (!response.ok) throw new Error('Update failed');
      
      const updatedData = await response.json();
      setUser(updatedData);
      setOriginalUser(updatedData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
    setError("");
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'DOCTOR':
        return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">Doctor</span>;
      case 'PATIENT':
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">Patient</span>;
      case 'ADMIN':
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">Administrator</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">{role}</span>;
    }
  };

  if (loading && !user) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-opacity-20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Area */}
      {(error || success) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Container with Relative Positioning */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left Sidebar */}
            <div className="md:w-1/3 border-r border-gray-200">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-medium">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                    {user?.is_active && (
                      <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 rounded-full border-4 border-white"></div>
                    )}
                  </div>
                  
                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={user?.first_name || ''}
                          onChange={(e) => setUser({...user!, first_name: e.target.value})}
                          className="w-full text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          value={user?.last_name || ''}
                          onChange={(e) => setUser({...user!, last_name: e.target.value})}
                          className="w-full text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${user?.first_name} ${user?.last_name}`
                    )}
                  </h2>
                  
                  <div className="mt-2">{getRoleBadge(user?.role || '')}</div>
                  
                  <div className="mt-6 w-full">
                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-gray-500">EMAIL</h3>
                      <p className="mt-1 break-all">{user?.email}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-gray-500">MEMBER SINCE</h3>
                      <p className="mt-1">{user?.date_joined ? formatDate(user.date_joined) : 'N/A'}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-gray-500">ID</h3>
                      <p className="mt-1">{user?.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="md:w-2/3">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-4 text-sm font-medium ${activeTab === "profile" 
                      ? "border-b-2 border-blue-500 text-blue-600" 
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    Profile Information
                  </button>
                  {user?.doctor_profile && (
                    <button
                      onClick={() => setActiveTab("professional")}
                      className={`px-4 py-4 text-sm font-medium ${activeTab === "professional" 
                        ? "border-b-2 border-blue-500 text-blue-600" 
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                      Professional Details
                    </button>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your personal information and how you appear to others in the system.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">FULL NAME</h4>
                          <p className="mt-1 text-gray-900">{user?.first_name} {user?.last_name}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">EMAIL ADDRESS</h4>
                          <p className="mt-1 text-gray-900">{user?.email}</p>
                          <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Please contact support for assistance.</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">ACCOUNT TYPE</h4>
                          <p className="mt-1 text-gray-900">
                            {user?.role ? capitalizeFirstLetter(user.role) : ''}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">ACCOUNT STATUS</h4>
                          <div className="mt-1 flex items-center">
                            <div className={`w-2.5 h-2.5 rounded-full ${user?.is_active ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                            <span>{user?.is_active ? "Active" : "Inactive"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "professional" && user?.doctor_profile && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your professional details visible to patients and administrators.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">SPECIALIZATION</h4>
                        {isEditing ? (
                          <input
                            type="text"
                            value={user.doctor_profile.specialization || ''}
                            onChange={(e) => setUser({
                              ...user!,
                              doctor_profile: {
                                ...user.doctor_profile,
                                specialization: e.target.value
                              }
                            })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{user.doctor_profile.specialization || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button Outside the Content Border */}
        <div className="absolute -bottom-8 left-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
