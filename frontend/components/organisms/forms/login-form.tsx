"use client";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { PasswordInput } from "@/components/ui/password-input";

interface DecodedToken {
  is_superuser?: boolean;
  role?: string;
}
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();

      // Store tokens in localStorage (or set them in HTTP-only cookies)
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Login successful!");

      // Decode the token to check if the user is admin

      const decoded: DecodedToken = jwtDecode(data.access);
      console.log("Decoded token:", decoded);

      // Check for admin role either via a role field or by is_superuser flag
      if (
        decoded.is_superuser ||
        decoded.role?.toLocaleLowerCase() === "admin"
      ) {
        // Redirect to admin dashboard
        window.location.href = "/admin";
      } else if (decoded.role?.toLocaleLowerCase() === "doctor") {
        // Redirect to doctor dashboard
        window.location.href = "/doctor";
      } else if (decoded.role?.toLocaleLowerCase() === "secretary") {
        // Redirect to doctor dashboard
        window.location.href = "/secretary";
      } else {
        // Redirect to standard dashboard or page for other users
        window.location.href = "/dashboard";
      }
    } catch (error: unknown) {
      console.error("Form submission error", error);
      toast.error("Failed to log in. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="******" {...field} />
              </FormControl>
              <FormDescription>Enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
