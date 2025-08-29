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
import { Facebook, ArrowRight, Loader2 } from "lucide-react";
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
      // 1) Log in and get tokens
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

      // 2) Fetch the current user’s info _synchronously_ before redirect
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/user/users/whoami/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const { id, role, is_superuser } = await userRes.json();

      // 3) Redirect based on role and ID
      if (is_superuser || role?.toLowerCase() === "admin") {
        window.location.href = "/admin";
      } else if (role?.toLowerCase() === "doctor") {
        window.location.href =
          id === "LFG4YJ2P" ? "/doctor" : "/oncall-doctors";
      } else if (role?.toLowerCase() === "secretary") {
        window.location.href = "/secretary";
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

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all duration-500 transform",
        animateIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
      {...props}
    >
      <div className="bg-linear-to-br from-primary/80 to-primary p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Sign in to continue to your account
        </p>
      </div>

      <div className="bg-card p-6 shadow-lg">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div
                    className={cn(
                      "group relative border rounded-xl transition-all duration-300",
                      focused === "email"
                        ? "border-primary shadow-xs ring-1 ring-primary/20"
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
                    {field.value && (
                      <div className="absolute right-3 top-4 text-green-500 opacity-100 transition-opacity duration-300">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.5 4.5L6.5 11.5L2.5 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <FormMessage className="mt-1 px-1 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div
                    className={cn(
                      "group relative border rounded-xl transition-all duration-300",
                      focused === "password"
                        ? "border-primary shadow-xs ring-1 ring-primary/20"
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
                  <div className="mt-1 flex justify-end">
                    <a
                      href="/forgot-password"
                      className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Forgot password?
                    </a>
                  </div>
                </FormItem>
              )}
            />

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

        <div className="relative mb-4 mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-xl border-border/50 transition-all duration-300 hover:bg-accent/50"
          type="button"
        >
          <div className="rounded-full bg-blue-500 p-1">
            <Facebook className="h-6 w-6 fill-white text-white" />
          </div>

          <span>Facebook</span>
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
