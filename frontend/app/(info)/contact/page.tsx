"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long")
    .trim(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      toast.success("Message sent successfully!");
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            We&apos;d love to hear from you! Fill out the form or reach out
            directly using our contact details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card space-y-8 rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">Contact Details</h2>
            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  text: "0999 820 5684 (Smart)",
                  href: "tel:+639998205684",
                },
                {
                  icon: Phone,
                  text: "0945 239 5382 (Globe)",
                  href: "tel:+639452395382",
                },
                {
                  icon: Mail,
                  text: "info@mediaproper.com",
                  href: "mailto:info@mediaproper.com",
                },
                {
                  icon: MapPin,
                  text: "130 Old Samson Rd. Barangay Apolonio Samson, Quezon City",
                },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="hover: flex items-center gap-3 transition-colors"
                  {...(item.href ? {} : { "aria-label": item.text })}
                >
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card space-y-6 rounded-2xl p-8 shadow-sm"
            noValidate
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { id: "firstName", label: "First Name", type: "text" },
                { id: "lastName", label: "Last Name", type: "text" },
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    {...register(field.id as keyof ContactFormData)}
                    className={
                      errors[field.id as keyof ContactFormData] &&
                      "border-red-500"
                    }
                    aria-invalid={
                      errors[field.id as keyof ContactFormData]
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      errors[field.id as keyof ContactFormData]
                        ? `${field.id}-error`
                        : undefined
                    }
                  />
                  {errors[field.id as keyof ContactFormData] && (
                    <p
                      id={`${field.id}-error`}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors[field.id as keyof ContactFormData]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email && "border-red-500"}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={errors.phone && "border-red-500"}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={5}
                className={errors.message && "border-red-500"}
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}