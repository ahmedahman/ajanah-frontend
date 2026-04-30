"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // API integration point
      console.log("[v0] Forgot password request:", data.email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error("[v0] Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="text-muted-foreground mt-2">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/login"
          className="flex items-center gap-1 text-primary text-sm font-medium mb-4 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="pl-10 h-12 bg-white border-border"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="h-5 w-5" /> : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
