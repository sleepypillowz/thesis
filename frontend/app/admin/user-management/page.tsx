"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit, UserPlus, Search, Filter, MoreHorizontal,Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userRole from "@/components/hooks/userRole";

// User Schema for Validation (for editing)
const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["admin", "doctor", "secretary"]),
  is_active: z.boolean().default(true)
});

// Edit User Schema (for editing)
const EditUserSchema = UserSchema.partial().extend({
  email: z.string().email("Invalid email address").optional()
});

// Create User Schema (for creation, include password fields)
// Note: Allowed roles exactly match the model: "admin", "doctor", "secretary"
const CreateUserSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "doctor", "secretary"]),
  is_active: z.boolean().default(true),
  password: z.string().min(6, "Password must be at least 6 characters"),
  re_password: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.password === data.re_password, {
  message: "Passwords do not match",
  path: ["re_password"],
});

type User = z.infer<typeof UserSchema>;
type EditUserFormData = z.infer<typeof EditUserSchema>;
type CreateUserFormData = z.infer<typeof CreateUserSchema>;

/** 
 * EditUserDialog is rendered outside of the dropdown.
 * It receives a "user" to edit, an "onClose" callback, and a callback to refresh the user list.
 */
function EditUserDialog({ user, onClose, onUpdated }: { user: User; onClose: () => void; onUpdated: () => void }) {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: user
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: EditUserFormData) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://127.0.0.1:8000/auth/users/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update user");
      toast.success("User updated successfully");
      onUpdated();
      onClose();
    } catch {
      toast.error("Error updating user");
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <Input {...form.register("first_name")} className="mt-1" />
            {form.formState.errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input {...form.register("last_name")} className="mt-1" />
            {form.formState.errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.last_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input {...form.register("email")} className="mt-1" />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              {...form.register("role")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="secretary">Medical Secretary</option>
            </select>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              {...form.register("is_active")}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">Active Account</label>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Update User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * CreateUserDialog works similarly, controlling its own open state.
 */
function CreateUserDialog({ onUserCreated }: { onUserCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'doctor', // default is doctor, but user can change it
      is_active: true,
      password: '',
      re_password: ''
    }
  });

  async function onSubmit(data: CreateUserFormData) {
    try {
      setIsSubmitting(true);
      const accessToken = localStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/user/register/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create user");
      toast.success("User created successfully");
      onUserCreated();
      setOpen(false);
    } catch {
      toast.error("Error creating user");
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
      <Dialog open={open} onOpenChange={(open) => {
        if (!open) form.reset();
        setOpen(open);
      }}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-600 hover:bg-blue-50">
          Create New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <Input {...form.register("first_name")} className="mt-1" />
            {form.formState.errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input {...form.register("last_name")} className="mt-1" />
            {form.formState.errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.last_name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input {...form.register("email")} className="mt-1" />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select 
              {...form.register("role")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="secretary">Medical Secretary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input type="password" {...form.register("password")} className="mt-1" />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <Input type="password" {...form.register("re_password")} className="mt-1" />
            {form.formState.errors.re_password && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.re_password.message}</p>
            )}
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              {...form.register("is_active")}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-900">Active Account</label>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const role = userRole();

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = useCallback(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRole) {
      result = result.filter(user => user.role === selectedRole);
    }
    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedRole, users, filterUsers]);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/auth/users/", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users");
    } finally{
      setIsLoading(false);
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  async function deleteUser(userId: number) {
    try {
      setDeletingId(userId);
      const accessToken = localStorage.getItem("access");
      const response = await fetch(`http://127.0.0.1:8000/auth/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    } finally{
      setDeletingId(null);
    }
  }

  // Only allow admin access
  if (!role || role.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Not Authorized
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your organization&apos;s user accounts and permissions</p>
          </div>
          <div className="flex space-x-3">
            <CreateUserDialog onUserCreated={fetchUsers} />
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg bg-gray-50 border-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-lg border-gray-300 bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <span>Filter by Role</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg w-48">
                <DropdownMenuItem onClick={() => setSelectedRole(null)}>
                  All Roles
                </DropdownMenuItem>
                {['admin', 'doctor', 'secretary'].map((role) => (
                  <DropdownMenuItem 
                    key={role} 
                    onClick={() => setSelectedRole(role)}
                    className="capitalize"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['User', 'Role', 'Status', 'Actions'].map((header) => (
                    <th 
                      key={header} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                          user.role === 'doctor' ? 'bg-green-100 text-green-700' : 
                          'bg-blue-100 text-blue-700'}
                      `}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm text-gray-700">
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-lg">
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-lg w-48">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="w-4 h-4 mr-2 text-gray-700" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                              className="text-red-600 hover:bg-red-50" 
                              onClick={() => user.id !== undefined && deleteUser(user.id)}
                              disabled={deletingId === user.id}
                            >
                              {deletingId === user.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
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

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <div className="max-w-md mx-auto">
                <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedRole ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || selectedRole 
                    ? 'Try adjusting your search or filter to find what you’re looking for.'
                    : 'Get started by creating a new user.'}
                </p>
                <CreateUserDialog onUserCreated={fetchUsers} />
              </div>
            </div>
          )}
        </div>
        
      </div>

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onUpdated={fetchUsers} 
        />
      )}
    </div>
    
  );
}
