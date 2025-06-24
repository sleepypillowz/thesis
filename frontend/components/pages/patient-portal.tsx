"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { FaPenToSquare, FaFile } from "react-icons/fa6";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile"); // Declared and initialized

  const profileData = {
    name: "Juan Dela Cruz",
    gender: "Male",
    dob: "12/31/1975",
    contact: {
      phone: "0911 505 3143",
      email: "sampleemail@gmail.com",
    },
    lastConsultation: "12/31/2002",
    diagnosis: "Diabetes",
    allergies: ["Penicillin", "Pollen"],
    medicalHistory: [
      "Hypertension (diagnosed 1998)",
      "Hyperlipidemia (diagnosed 2000)",
      "Appendectomy (1985)",
    ],
    familyHistory: [
      "Father with history of heart disease",
      "Mother with Type 2 Diabetes",
    ],
  };

  const appointments = [
    {
      type: "Chest X-Ray",
      date: "December 06 2024",
      doctor: "Dr. Johnny",
    },
  ];

  const prescriptions = [
    {
      drug: "Paracetamol Biogesic",
      units: 2,
      dosage: "Twice",
      days: 7,
      time: "10:30",
    },
  ];

  const results = [
    { name: "Juan Dela Cruz Lab Result", viewLink: "/#", downloadLink: "/#" },
    { name: "Juan Dela Cruz Lab Result", viewLink: "/#", downloadLink: "/#" },
    { name: "Juan Dela Cruz Lab Result", viewLink: "/#", downloadLink: "/#" },
  ];

  const notes = [
    "Diet and exercise counseling recommended.",
    "Follow up in 2 weeks for blood glucose monitoring and medication adjustment",
  ];

  return (
    <main className="min-h-screen flex-1 bg-gray-50 p-4 dark:bg-gray-900 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Patient Dashboard
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-800 sm:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Profile Section */}
          <TabsContent value="profile">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="content-center space-y-4 text-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {profileData.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {profileData.gender} | {profileData.dob}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Contact Details</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {profileData.contact.phone}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {profileData.contact.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Last Consultation
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {profileData.lastConsultation}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Current Diagnosis
                      </h3>
                      <Badge variant="secondary">{profileData.diagnosis}</Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Allergies</h3>
                      <div className="flex gap-2">
                        {profileData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Medical History</h3>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                        {profileData.medicalHistory.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Family History</h3>
                      <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                        {profileData.familyHistory.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Section */}
          <TabsContent value="appointments">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Appointments</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" size="sm">
                    Request Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Doctor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appt, index) => (
                      <TableRow key={index}>
                        <TableCell>{appt.type}</TableCell>
                        <TableCell>{appt.date}</TableCell>
                        <TableCell>{appt.doctor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Link
                  href="/patient/appointments"
                  className="mt-4 flex items-center justify-end gap-2 text-blue-500 hover:text-blue-700"
                >
                  <span>View All Appointments</span>
                  <FaPenToSquare />
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Section */}
          <TabsContent value="prescriptions">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Drug Name</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription, index) => (
                      <TableRow key={index}>
                        <TableCell>{prescription.drug}</TableCell>
                        <TableCell>{prescription.units}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.days}</TableCell>
                        <TableCell>{prescription.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Link
                  href="/patient/prescriptions"
                  className="mt-4 flex items-center justify-end gap-2 text-blue-500 hover:text-blue-700"
                >
                  <span>View All Prescriptions</span>
                  <FaPenToSquare />
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Section */}
          <TabsContent value="results">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Lab Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <FaFile className="text-blue-500" />
                        <span>{result.name}</span>
                      </div>
                      <div className="flex gap-4">
                        <Link
                          href={result.viewLink}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </Link>
                        <Link
                          href={result.downloadLink}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Download
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Section */}
          <TabsContent value="notes">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Diagnosis: Type 2 Diabetes</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-300">
                  {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
