"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/config/supabase";
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
import { PasswordInput } from "@/components/ui/password-input";
import HeroHeader from "@/components/organisms/hero-header";
import { useState } from "react";

const formSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    const { email, password } = values;

    // Check if the email already exists in Supabase Auth
    const { data: existingUsers, error: fetchError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setErrorMessage("Error checking email availability.");
      return;
    }

    if (existingUsers) {
      setErrorMessage("Email is already in use.");
      return;
    }

    // Register the user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.user) {
      // Add user to profiles table with default role as "patient"
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, role: "patient", email }]);

      if (profileError) {
        setErrorMessage(profileError.message);
      } else {
        setSuccessMessage(
          "Registration successful! Check your email for confirmation."
        );
      }
    }
  }

  return (
    <>
      <HeroHeader />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-8 py-10"
        >
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@mail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Register</Button>
        </form>
      </Form>
    </>
  );
}
