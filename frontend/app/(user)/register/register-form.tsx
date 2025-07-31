"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowRight, Loader2 } from "lucide-react";

const formSchema = z
  .object({
    first_name: z.string().min(1, { message: "Required" }),
    last_name: z.string().min(1, { message: "Required" }),
    username: z
      .string()
      .min(1, { message: "Required" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Username must be alphanumeric",
      }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Minimum 8 characters" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Password must be alphanumeric",
      }),
    confirm_password: z.string().min(1, { message: "Required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            username: values.username,
            password: values.password,
            first_name: values.first_name,
            last_name: values.last_name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      toast.success("Registration successful!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error", error);
      toast.error("Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all duration-500 transform",
        animateIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
      {...props}
    >
      <div className="bg-gradient-to-br from-primary/80 to-primary p-6 text-white">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Register to get started
        </p>
      </div>

      <div className="bg-card p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {["first_name", "last_name", "username", "email"].map(
              (fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className={cn(
                          "group relative border rounded-xl transition-all duration-300",
                          focused === field.name
                            ? "border-primary shadow-sm ring-1 ring-primary/20"
                            : "border-border",
                          form.formState.errors[field.name]
                            ? "border-destructive"
                            : ""
                        )}
                      >
                        <FormControl>
                          <Input
                            placeholder={
                              field.name
                                .replace("_", " ")
                                .replace(/^\w/, (c) => c.toUpperCase()) || ""
                            }
                            className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            onFocus={() => setFocused(field.name)}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="mt-1 px-1 text-xs" />
                    </FormItem>
                  )}
                />
              )
            )}

            {["password", "confirm_password"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <div
                      className={cn(
                        "group relative border rounded-xl transition-all duration-300",
                        focused === field.name
                          ? "border-primary shadow-sm ring-1 ring-primary/20"
                          : "border-border",
                        form.formState.errors[field.name]
                          ? "border-destructive"
                          : ""
                      )}
                    >
                      <FormControl>
                        <PasswordInput
                          placeholder={
                            field.name === "confirm_password"
                              ? "Confirm Password"
                              : "Password"
                          }
                          className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                          onFocus={() => setFocused(field.name)}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="mt-1 px-1 text-xs" />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign up</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
