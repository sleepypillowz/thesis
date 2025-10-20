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
import {
  ArrowRight,
  Loader2,
  User,
  Shield,
  Stethoscope,
  Clipboard,
} from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Required" }),
});

export function LoginForm({
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
      email: "",
      password: "",
    },
  });

  const watchEmail = form.watch("email");
  const watchPassword = form.watch("password");
  const isFormFilled = watchEmail.length > 0 && watchPassword.length > 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/jwt/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );
      if (!loginRes.ok) {
        const { detail } = await loginRes.json();
        throw new Error(detail || "Login failed");
      }
      const { access, refresh } = await loginRes.json();
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/whoami/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const {role, is_superuser } = await userRes.json();

      if (is_superuser || role?.toLowerCase() === "admin") {
        window.location.href = "/admin";
      } else if (role?.toLowerCase() === "doctor") {
        window.location.href = "/doctor";
      } else if (role?.toLowerCase() === "on-call-doctor") {
        window.location.href = "/oncall-doctors";
      } else if (role?.toLowerCase() === "secretary") {
        window.location.href = "/secretary";
      } else if (role?.toLowerCase() === "patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: unknown) {
      console.error("Login or user fetch error", error);
      toast.error("Invalid credentials or network error");
    } finally {
      setIsLoading(false);
    }
  }

  const testAccounts = [
    {
      label: "General Doctor",
      email: "generaldoctor@hospital.com",
      password: "securepassword123",
      icon: Stethoscope,
    },
    {
      label: "Secretary",
      email: "secretaryaccount@gmail.com",
      password: "nVmTfEkCFeB3APi",
      icon: Clipboard,
    },
    {
      label: "On-Call Doctor",
      email: "cardiologist@hospital.com",
      password: "securepassword123",
      icon: Shield,
    },
    {
      label: "Admin",
      email: "admin@gmail.com",
      password: "10200922",
      icon: User,
    },
  ];

  // Autofill helper
  const autoFill = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

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
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Sign in to continue to your account
        </p>
      </div>

      <div className="bg-card p-6 shadow-lg">
        {/* Autofill buttons */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {testAccounts.map((acc) => {
            const Icon = acc.icon;
            return (
              <Button
                key={acc.label}
                type="button"
                variant="outline"
                onClick={() => autoFill(acc.email, acc.password)}
                className="flex h-12 items-center justify-start gap-2 rounded-2xl border border-border/50 bg-muted/40 px-4 shadow-sm transition-all hover:scale-105 hover:bg-primary/10 hover:shadow-md"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{acc.label}</span>
              </Button>
            );
          })}
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-5"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div
                    className={cn(
                      "group relative border rounded-xl transition-all duration-300",
                      focused === "email"
                        ? "border-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border",
                      form.formState.errors.email ? "border-destructive" : ""
                    )}
                  >
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        onFocus={() => setFocused("email")}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="mt-1 px-1 text-xs" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div
                    className={cn(
                      "group relative border rounded-xl transition-all duration-300",
                      focused === "password"
                        ? "border-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border",
                      form.formState.errors.password ? "border-destructive" : ""
                    )}
                  >
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        className="h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        onFocus={() => setFocused("password")}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="mt-1 px-1 text-xs" />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className={cn(
                "w-full h-12 mt-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                isFormFilled && !isLoading
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary/80"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isFormFilled ? "translate-x-1" : ""
                    )}
                  />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
