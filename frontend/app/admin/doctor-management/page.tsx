"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Trash2,
  Edit,
  UserPlus,
  Search,
  MoreHorizontal,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Schedule {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface DoctorProfile {
  specialization: string;
  schedules: Schedule[];
}

interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  doctor_profile: DoctorProfile;
  role: "admin" | "doctor" | "secretary";
}

interface DoctorFormData {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  re_password?: string;
  role: "doctor";
  doctor_profile: {
    specialization: string;
    schedules: Schedule[];
  };
}

export default function DoctorManagement() {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<DoctorFormData>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      doctor_profile: {
        specialization: "",
        schedules: []
      }
    }
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // This effect preloads the form values including schedules when editing a doctor.
  useEffect(() => {
    if (currentDoctor) {
      reset({
        email: currentDoctor.email,
        first_name: currentDoctor.first_name,
        last_name: currentDoctor.last_name,
          doctor_profile: {
            specialization: currentDoctor.doctor_profile?.specialization || "",
            schedules: currentDoctor.doctor_profile?.schedules || []
          }

      });
    } else {
      reset({
        email: "",
        first_name: "",
        last_name: "",
        doctor_profile: {
          specialization: "",
          schedules: []
        }
      });
    }
  }, [currentDoctor, reset]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/users/?role=doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentDoctor(null);
    reset({
      email: "",
      first_name: "",
      last_name: "",
      doctor_profile: {
        specialization: "",
        schedules: []
      }
    });
  };

  const onSubmit = async (data: DoctorFormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const method = currentDoctor ? "PATCH" : "POST";
      const url = currentDoctor 
        ? `${process.env.NEXT_PUBLIC_API_BASE}/user/users/${currentDoctor.id}/`
        : `${process.env.NEXT_PUBLIC_API_BASE}/user/users/`;

      const body = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: "doctor",
        doctor_profile: {
          specialization: data.doctor_profile.specialization,
          schedules: data.doctor_profile.schedules.map(schedule => ({
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time
          }))
        }
      };

      if (!currentDoctor) {
        Object.assign(body, {
          password: data.password,
          re_password: data.re_password
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      
      handleCloseDialog();
      await fetchDoctors();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      await fetchDoctors();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentDoctor(null)}>
                <UserPlus className="mr-2 h-4 w-4" />
                New Doctor
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-[600px]" 
              onInteractOutside={(e) => loading && e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>
                  {currentDoctor ? "Edit Doctor" : "New Doctor"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!currentDoctor && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        {...register("password", { 
                          required: !currentDoctor && "Password is required" 
                        })}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm Password
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        {...register("re_password", { 
                          required: !currentDoctor && "Please confirm password",
                          validate: value => 
                            !currentDoctor && value === watch('password') || 
                            "Passwords don't match"
                        })}
                      />
                      {errors.re_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.re_password.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("first_name", { required: "First name is required" })}
                      defaultValue={currentDoctor?.first_name}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("last_name", { required: "Last name is required" })}
                      defaultValue={currentDoctor?.last_name}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    defaultValue={currentDoctor?.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Doctor Information</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Specialization
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("doctor_profile.specialization", { 
                        required: "Specialization is required" 
                      })}
                      defaultValue={currentDoctor?.doctor_profile.specialization}
                    />
                    {errors.doctor_profile?.specialization && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.doctor_profile.specialization.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium">
                        Schedules
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setValue("doctor_profile.schedules", [
                            ...(watch("doctor_profile.schedules") || []),
                            { day_of_week: "Monday", start_time: "09:00", end_time: "17:00" },
                          ])
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Schedule
                      </Button>
                    </div>
                    {watch("doctor_profile.schedules")?.map((_, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-center">
                        <select
                          {...register(`doctor_profile.schedules.${index}.day_of_week`)}
                          className="p-2 rounded border"
                        >
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <Input
                          type="time"
                          {...register(`doctor_profile.schedules.${index}.start_time`)}
                        />
                        <Input
                          type="time"
                          {...register(`doctor_profile.schedules.${index}.end_time`)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const schedules = watch("doctor_profile.schedules")?.filter(
                              (_, i) => i !== index
                            );
                            setValue("doctor_profile.schedules", schedules);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleCloseDialog}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : currentDoctor ? (
                      "Save Changes"
                    ) : (
                      "Create Doctor"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Specialization</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id} className="border-t">
                <td className="p-4">{`${doctor.first_name} ${doctor.last_name}`}</td>
                <td className="p-4">{doctor.email}</td>
                <td className="p-4">
                  {doctor.doctor_profile?.specialization || "Not set"}
                </td>

                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentDoctor(doctor);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(doctor.id)}
                        disabled={deleteLoading === doctor.id}
                      >
                        {deleteLoading === doctor.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
