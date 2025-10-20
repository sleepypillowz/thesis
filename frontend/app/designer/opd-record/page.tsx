"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Download, Save } from "lucide-react";

// Form validation schema
const medicalRecordSchema = z.object({
  // Patient Information
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().min(1, "Age is required"),
  status: z.string().min(1, "Status is required"),
  sex: z.string().min(1, "Sex is required"),
  height: z.string().optional(),
  weight: z.string().optional(),
  mobileNumber: z.string().min(1, "Mobile number is required"),

  // Visit Information
  visitDate: z.string().min(1, "Visit date is required"),
  visitTime: z.string().min(1, "Visit time is required"),
  healthRecordNumber: z.string().min(1, "Health record number is required"),

  // Medical Information
  allergies: z.string().optional(),
  pulse: z.string().optional(),
  bloodPressure: z.string().optional(),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  physicalExam: z.string().optional(),
  pathologyResults: z.string().optional(),
  diagnosis: z.string().optional(),
  physicianNotes: z.string().optional(),
});

type MedicalRecordForm = z.infer<typeof medicalRecordSchema>;

// Sample data that would come from your database
const samplePatientData: Partial<MedicalRecordForm> = {
  lastName: "Dela Cruz",
  firstName: "Juan",
  middleName: "Santos",
  address: "123 Rizal Street, Quezon City, Metro Manila",
  dateOfBirth: "1985-05-15",
  age: "39",
  status: "Single",
  sex: "Male",
  height: "170",
  weight: "70",
  mobileNumber: "+63 912 345 6789",
  visitDate: "2024-08-23",
  visitTime: "10:30",
  healthRecordNumber: "HRN-2024-001234",
  allergies: "No known allergies",
  pulse: "72",
  bloodPressure: "120/80",
  chiefComplaint: "Routine check-up",
  physicalExam: "Patient appears well, no acute distress",
  pathologyResults: "Complete Blood Count - Normal limits",
  diagnosis: "Healthy adult for routine screening",
  physicianNotes: "Continue current lifestyle habits. Next visit in 6 months.",
};

export default function MedicalRecordForm() {
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<MedicalRecordForm>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: samplePatientData, // This would be replaced with data from your DB
  });

  const onSubmit = async (data: MedicalRecordForm) => {
    try {
      // Here you would save to your database
      console.log("Saving to database:", data);

      // Example API call:
      // const response = await fetch('/api/medical-records', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      alert("Medical record saved successfully!");
    } catch (error) {
      console.error("Error saving medical record:", error);
      alert("Failed to save medical record");
    }
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF("p", "mm", "a4");
      const formData = form.getValues();

      // Page margins and settings
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addWrappedText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize = 10
      ) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * (fontSize * 0.4);
      };

      // Header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        "MALIBIRAN MEDICAL CLINIC WITH DIAGNOSTIC AND LABORATORY",
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 7;
      doc.text("SERVICES", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "130 Old Samson Rd. Brgy. Apolonio Samson QC",
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 15;

      // Date and Health Record Number
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Date and Time of Visit", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${formData.visitDate || ""}`, margin, yPosition);
      doc.text(
        `Health Record Number: ${formData.healthRecordNumber || ""}`,
        pageWidth - margin - 80,
        yPosition
      );
      yPosition += 6;
      doc.text(`Time: ${formData.visitTime || ""}`, margin, yPosition);
      yPosition += 15;

      // OPD Record Title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("OPD RECORD", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      // Patient Name
      doc.setFontSize(10);
      doc.text("PATIENT NAME:", margin, yPosition);
      yPosition += 8;

      // Name fields
      const nameY = yPosition;
      doc.text("LAST NAME", margin, nameY);
      doc.text("FIRST NAME", margin + 60, nameY);
      doc.text("MIDDLE NAME", margin + 120, nameY);
      yPosition += 6;

      doc.setFont("helvetica", "normal");
      doc.text(formData.lastName || "", margin, yPosition);
      doc.text(formData.firstName || "", margin + 60, yPosition);
      doc.text(formData.middleName || "", margin + 120, yPosition);
      yPosition += 12;

      // Address and Date of Birth
      doc.setFont("helvetica", "bold");
      doc.text(`ADDRESS: `, margin, yPosition);
      doc.text("DATE OF BIRTH:", margin + 120, yPosition);
      yPosition += 6;

      doc.setFont("helvetica", "normal");
      doc.text(formData.address || "", margin + 20, yPosition - 6);
      doc.text(formData.dateOfBirth || "", margin + 150, yPosition - 6);
      yPosition += 6;

      // Personal Details Row
      doc.setFont("helvetica", "bold");
      const detailsY = yPosition;
      doc.text("AGE:", margin, detailsY);
      doc.text("STATUS:", margin + 25, detailsY);
      doc.text("SEX:", margin + 60, detailsY);
      doc.text("HEIGHT:", margin + 85, detailsY);
      doc.text("WEIGHT:", margin + 115, detailsY);
      doc.text("MOBILE NUMBER:", margin + 145, detailsY);
      yPosition += 6;

      doc.setFont("helvetica", "normal");
      doc.text(formData.age || "", margin, yPosition);
      doc.text(formData.status || "", margin + 25, yPosition);
      doc.text(formData.sex || "", margin + 60, yPosition);
      doc.text(formData.height || "", margin + 85, yPosition);
      doc.text(formData.weight || "", margin + 115, yPosition);
      doc.text(formData.mobileNumber || "", margin + 145, yPosition);
      yPosition += 15;

      // Two column layout for Allergies and Vital Signs
      const leftColWidth = contentWidth / 2 - 5;
      const rightColX = margin + leftColWidth + 10;

      // Allergies
      doc.setFont("helvetica", "bold");
      doc.text("ALLERGIES:", margin, yPosition);
      doc.text("VITAL SIGNS:", rightColX, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      const allergiesEndY = addWrappedText(
        formData.allergies || "",
        margin,
        yPosition,
        leftColWidth - 10
      );

      // Vital Signs
      doc.text(`PULSE: ${formData.pulse || ""}`, rightColX, yPosition);
      doc.text(`BP: ${formData.bloodPressure || ""}`, rightColX, yPosition + 6);

      yPosition = Math.max(allergiesEndY, yPosition + 20);

      // Chief Complaint
      doc.setFont("helvetica", "bold");
      doc.text("CHIEF COMPLAINT:", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        formData.chiefComplaint || "",
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 10;

      // Physical Exam
      doc.setFont("helvetica", "bold");
      doc.text("PHYSICAL EXAM:", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        formData.physicalExam || "",
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        doc.addPage();
        yPosition = margin;
      }

      // Pathology and Laboratory Results
      doc.setFont("helvetica", "bold");
      doc.text(
        "PATHOLOGY AND LABORATORY RESULTS: (SEE ATTACHMENTS)",
        margin,
        yPosition
      );
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        formData.pathologyResults || "",
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 10;

      // Diagnosis
      doc.setFont("helvetica", "bold");
      doc.text("DIAGNOSIS:", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        formData.diagnosis || "",
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 10;

      // Physician's Notes
      doc.setFont("helvetica", "bold");
      doc.text("PHYSICIANS NOTES:", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        formData.physicianNotes || "",
        margin,
        yPosition,
        contentWidth
      );
      yPosition += 20;

      // Physician's Signature
      doc.line(
        pageWidth - margin - 60,
        yPosition,
        pageWidth - margin,
        yPosition
      );
      yPosition += 5;
      doc.setFontSize(8);
      doc.text("PHYSICIANS SIGNATURE", pageWidth - margin - 30, yPosition, {
        align: "center",
      });

      // Save the PDF
      const filename = `medical-record-${
        formData.healthRecordNumber || "new"
      }.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medical Record Management</h1>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button type="submit" form="medical-record-form">
            <Save className="mr-2 h-4 w-4" />
            Save Record
          </Button>
        </div>
      </div>

      <div ref={formRef} className="rounded-lg bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Malibiran Medical Clinic with Diagnostic and Laboratory Services
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            130 Old Samson Rd. Brgy. Apolonio Samson QC
          </p>
        </div>

        <Form {...form}>
          <form
            id="medical-record-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Visit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date and Time of Visit
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visitTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthRecordNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Record Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                OPD Record
              </h3>
            </div>

            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pulse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pulse</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chief Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Physical Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="physicalExam"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pathology and Laboratory Results</CardTitle>
                <p className="text-sm text-gray-600">(See Attachments)</p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="pathologyResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Physicians Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="physicianNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <Separator className="mb-2 w-48" />
                    <p className="text-sm text-gray-600">
                      Physicians Signature
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
