"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorSettings() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Tabs defaultValue="profile" className="mx-auto mt-8 w-full max-w-4xl">
      <TabsList className="grid grid-cols-4 gap-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      {/* Profile Settings */}
      <TabsContent value="profile">
        <div className="mt-4 space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Dr. John Doe" />
          </div>
          <div>
            <Label>Specialization</Label>
            <Input placeholder="Cardiologist" />
          </div>
          <div>
            <Label>License Number</Label>
            <Input placeholder="1234-5678" />
          </div>
          <div>
            <Label>Affiliation</Label>
            <Input placeholder="City Medical Hospital" />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea placeholder="Brief introduction or professional summary" />
          </div>
          <Button className="mt-4">Save Profile</Button>
        </div>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account">
        <div className="mt-4 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="doctor@example.com" />
          </div>
          <div>
            <Label>Change Password</Label>
            <Input type="password" placeholder="New Password" />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Enable 2FA</Label>
            <Switch />
          </div>
          <Button className="mt-4">Update Account</Button>
        </div>
      </TabsContent>

      {/* Availability Settings */}
      <TabsContent value="availability">
        <div className="mt-4 space-y-4">
          <div>
            <Label>Working Days</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  variant={selectedDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Working Hours</Label>
            <Input placeholder="e.g., 9:00 AM - 5:00 PM" />
          </div>
          <div>
            <Label>Breaks / Time Off</Label>
            <Input placeholder="e.g., Lunch 12:00 PM - 1:00 PM" />
          </div>
          <div>
            <Label>Appointment Slot Duration (minutes)</Label>
            <Input type="number" placeholder="30" />
          </div>
          <Button className="mt-4">Save Availability</Button>
        </div>
      </TabsContent>

      {/* Preferences Settings */}
      <TabsContent value="preferences">
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Label>Email Notifications</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center space-x-2">
            <Label>In-App Notifications</Label>
            <Switch />
          </div>
          <div>
            <Label>Consultation Fee</Label>
            <Input type="number" placeholder="₱500" />
          </div>
          <div>
            <Label>Consultation Types</Label>
            <Input placeholder="In-person, Telemedicine" />
          </div>
          <Button className="mt-4">Save Preferences</Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
