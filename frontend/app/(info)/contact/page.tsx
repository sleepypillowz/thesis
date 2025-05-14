"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // You can send this data to your backend or third-party service
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 md:p-12">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Side: Contact Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="">
            Feel free to use the form or drop us an email. Old-fashioned phone
            calls work too.
          </p>
          <div className="flex items-center gap-3">
            <Phone />
            <span>0999 820 5684 (Smart)</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone />
            <span>0945 239 5382 (Globe)</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail />
            <span>info@mediaproper.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin />
            <span>130 Old Samson Rd.</span>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input placeholder="First" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Input placeholder="Last" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <Input
              placeholder="example@email.com"
              type="email"
              {...register("email")}
            />
            {errors.email && <p className="text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              placeholder="Phone (optional)"
              type="tel"
              {...register("phone")}
            />
          </div>
          <div>
            <Textarea
              placeholder="Type your message..."
              rows={5}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" className="text-white">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
