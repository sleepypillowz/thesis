"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First Name is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters are allowed"),
  middle_name: z
    .string()
    .trim()
    .regex(/^[A-Z\s]?$/, "Only letters are allowed")
    .optional(),
  last_name: z
    .string()
    .trim()
    .min(1, "Last Name is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters are allowed"),
  month: z.string().min(1, "Month is required"),
  day: z.string().min(1, "Day is required"),
  year: z.string().min(1, "Year is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone_number: z
    .string()
    .min(1, "Phone Number is required")
    .max(13)
    .regex(
      /^09\d{2} \d{3} \d{4}$/,
      "Phone number must start with 09 and have 11 digits (e.g., 09123 456 789)"
    ),
  street: z.string().min(1, "Street is required"),
  barangay: z.string().min(1, "Barangay is required"),
  city: z.string().min(1, "City is required"),
  complaint: z.string().min(1, "Complaint is required"),
  priority: z.string().min(1, "Priority is required"),
});

export default function RegistrationForm() {
  const complaints = [
    {
      label: "general illness",
      value: "general-illness",
    },
    {
      label: "injury",
      value: "injury",
    },
    {
      label: "checkup",
      value: "checkup",
    },
    {
      label: "other",
      value: "other",
    },
  ] as const;

  const priorities = [
    {
      label: "Regular",
      value: "Regular",
    },
    {
      label: "Priority(PWD/Pregnant)",
      value: "Priority",
    },
  ] as const;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      month: "",
      day: "",
      year: "",
      email: "",
      phone_number: "",
      street: "",
      barangay: "",
      city: "",
      complaint: "",
      priority: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const [openComplaint, setOpenComplaint] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-4 py-10"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Patient Registration</h1>
            <Button>
              <Link href="/admin/old-patient/old-patient-registration">
                Existing Patient
              </Link>
            </Button>
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jane"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow letters and spaces
                        value = value.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        ); // Auto capitalize first letters
                        field.onChange(value); // Update form state
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="M"
                      type="text"
                      maxLength={1} // Ensures only one character
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^A-Za-z\s]/g, "")
                          .toUpperCase()
                          .slice(0, 1);
                        field.onChange(value); // Update form state
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      type="text"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow letters and spaces
                        value = value.replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        ); // Auto capitalize first letters
                        field.onChange(value); // Update form state
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12"
                      type="text" // Use "text" to control input behavior manually
                      value={field.value}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                        if (value) {
                          value = Math.max(
                            1,
                            Math.min(12, Number(value))
                          ).toString(); // Keep within range
                        }
                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault(); // Block invalid keys
                        }
                      }}
                      inputMode="numeric" // Mobile keyboards show number pad
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Date of Birth</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Day</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="31"
                      type="text" // Use "text" to manually control input
                      value={field.value}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                        if (value) {
                          value = Math.max(
                            1,
                            Math.min(31, Number(value))
                          ).toString(); // Ensure 1-31
                        }
                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2000"
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                        if (value.length > 4) {
                          value = value.slice(0, 4); // Limit to 4 digits
                        }

                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      placeholder="09XX XXX XXXX"
                      type="tel"
                      maxLength={13} // Adjusted to account for spaces
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                        // Format the number as XXXX XXX XXXX
                        if (value.length > 4 && value.length <= 7) {
                          value = `${value.slice(0, 4)} ${value.slice(4)}`;
                        } else if (value.length > 7) {
                          value = `${value.slice(0, 4)} ${value.slice(
                            4,
                            7
                          )} ${value.slice(7)}`;
                        }

                        field.onChange(value); // Update form state
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="janedoe@gmail.com" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St." type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barangay"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input placeholder="Pasong Tamo" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Quezon City" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="complaint"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Complaint</FormLabel>
                  <Popover open={openComplaint} onOpenChange={setOpenComplaint}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value
                          ? complaints.find((c) => c.value === field.value)
                              ?.label
                          : "Select complaint"}
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                      <Command>
                        <CommandInput placeholder="Search complaints..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {complaints.map((c) => (
                              <CommandItem
                                key={c.value}
                                onSelect={() => {
                                  form.setValue("complaint", c.value);
                                  setOpenComplaint(false); // Close popover on selection
                                }}
                              >
                                {c.label}
                                {field.value === c.value && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Priority</FormLabel>
                  <Popover open={openPriority} onOpenChange={setOpenPriority}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={() => setOpenPriority((prev) => !prev)}
                        >
                          {field.value
                            ? priorities.find(
                                (priority) => priority.value === field.value
                              )?.label
                            : "Select priority"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search priority..." />
                        <CommandList>
                          <CommandEmpty>No priority found.</CommandEmpty>
                          <CommandGroup>
                            {priorities.map((priority) => (
                              <CommandItem
                                value={priority.label}
                                key={priority.value}
                                onSelect={() => {
                                  form.setValue("priority", priority.value);
                                  setOpenPriority(false); // Close popover after selection
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    priority.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {priority.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Register Patient</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
