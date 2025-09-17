"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    custom_specialization?: string;
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
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/user/users/current-profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
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
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/update-me/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: user?.first_name,
            last_name: user?.last_name,
            doctor_profile: user?.doctor_profile,
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedData = await response.json();
      setUser(updatedData);
      setOriginalUser(updatedData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "DOCTOR":
        return (
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
            Doctor
          </span>
        );
      case "PATIENT":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            Patient
          </span>
        );
      case "ADMIN":
        return (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
            Administrator
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {role}
          </span>
        );
    }
  };

  if (loading && !user)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20">
            <div className="absolute left-0 top-0 h-full w-full rounded-full border-4 border-blue-500 border-opacity-20"></div>
            <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-t-blue-500"></div>
          </div>
          <p className="mt-6 font-medium text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">My Account</h1>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  {loading ? (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Area */}
      {(error || success) && (
        <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-md border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md border-l-4 border-green-400 bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
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
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="card overflow-hidden rounded-2xl">
          <div className="md:flex">
            {/* Left Sidebar */}
            <div className="border-r border-gray-200 md:w-1/3">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full text-4xl font-medium">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </div>
                    {user?.is_active && (
                      <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-white bg-green-500"></div>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-bold">
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <Input
                          type="text"
                          value={user?.first_name || ""}
                          onChange={(e) =>
                            setUser({ ...user!, first_name: e.target.value })
                          }
                          className="w-full rounded-lg border border-muted-foreground px-3 py-2 text-center"
                          placeholder="First Name"
                        />
                        <Input
                          type="text"
                          value={user?.last_name || ""}
                          onChange={(e) =>
                            setUser({ ...user!, last_name: e.target.value })
                          }
                          className="w-full rounded-lg border border-muted-foreground px-3 py-2 text-center"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      `${user?.first_name} ${user?.last_name}`
                    )}
                  </h2>

                  <div className="mt-2">{getRoleBadge(user?.role || "")}</div>

                  <div className="mt-6 w-full">
                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        EMAIL
                      </h3>
                      <p className="mt-1 break-all">{user?.email}</p>
                    </div>

                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        MEMBER SINCE
                      </h3>
                      <p className="mt-1">
                        {user?.date_joined
                          ? formatDate(user.date_joined)
                          : "N/A"}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 py-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        ID
                      </h3>
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
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-4 text-sm font-medium ${
                      activeTab === "profile"
                        ? "border-b-2"
                        : "text-muted-foreground"
                    }`}
                  >
                    Profile Information
                  </Button>
                  {user?.doctor_profile && (
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab("professional")}
                      className={`px-4 py-4 text-sm font-medium ${
                        activeTab === "professional"
                          ? "border-b-2"
                          : "text-muted-foreground"
                      }`}
                    >
                      Professional Details
                    </Button>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "profile" && (
                  <div className="card bg-muted">
                    <div>
                      <h3 className="text-lg font-medium">
                        Profile Information
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Update your personal information and how you appear to
                        others in the system.
                      </p>
                    </div>

                    <div className="rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            FULL NAME
                          </h4>
                          <p className="mt-1">
                            {user?.first_name} {user?.last_name}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            EMAIL ADDRESS
                          </h4>
                          <p className="mt-1">{user?.email}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Email cannot be changed. Please contact support for
                            assistance.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            ACCOUNT TYPE
                          </h4>
                          <p className="mt-1">
                            {user?.role ? capitalizeFirstLetter(user.role) : ""}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">
                            ACCOUNT STATUS
                          </h4>
                          <div className="mt-1 flex items-center">
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                user?.is_active ? "bg-green-500" : "bg-red-500"
                              } mr-2`}
                            ></div>
                            <span>
                              {user?.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "professional" && user?.doctor_profile && (
                  <div className="card bg-muted">
                    <div>
                      <h3 className="text-lg font-medium">
                        Professional Information
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Manage your professional details visible to patients and
                        administrators.
                      </p>
                    </div>

                    <div className="rounded-lg p-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          SPECIALIZATION
                        </h4>
                        {isEditing ? (
                          <div className="mt-1">
                            <select
                              value={user.doctor_profile.specialization || ""}
                              onChange={(e) =>
                                setUser({
                                  ...user!,
                                  doctor_profile: {
                                    ...user.doctor_profile,
                                    specialization: e.target.value,
                                  },
                                })
                              }
                              className="w-full rounded-lg border px-3 py-2"
                            >
                              <option value="">Select a specialization</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Cardiologist">Cardiologist</option>
                              <option value="General Doctor">General Doctor</option>
                              <option value="other">Other (specify below)</option>
                            </select>
                            
                              {user.doctor_profile.specialization === "other" && (
                                <Input
                                  type="text"
                                  placeholder="Enter your specialization"
                                  value={user.doctor_profile.custom_specialization || ""}
                                  onChange={(e) =>
                                    setUser({
                                      ...user!,
                                      doctor_profile: {
                                        ...user.doctor_profile,
                                        specialization: user.doctor_profile?.specialization || "", // <-- always set to string
                                        custom_specialization: e.target.value,
                                      },
                                    })
                                  }
                                  className="mt-2 w-full rounded-lg border px-3 py-2"
                                />
                            )}
                          </div>
                        ) : (
                          <p className="mt-1">
                            {user.doctor_profile.specialization === "other" 
                              ? user.doctor_profile.custom_specialization || "Not specified"
                              : user.doctor_profile.specialization || "Not specified"
                            }
                          </p>
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
          <Button
            onClick={() => router.back()}
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
