"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    try {
      // API integration point
      console.log("[v0] Reset password data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch (error) {
      console.error("[v0] Reset password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
          {/* Success Badge */}
          <div className="mx-auto relative w-32 h-32">
            {/* Outer circle */}
            <div className="absolute inset-0 rounded-full border-4 border-primary" />
            {/* Inner wavy badge */}
            <div className="absolute inset-4 bg-brand-green-light rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                <path
                  d="M50 10 C60 20, 70 15, 80 25 C90 35, 85 45, 90 55 C95 65, 90 75, 80 80 C70 85, 65 95, 55 90 C45 85, 35 90, 25 80 C15 70, 10 65, 15 55 C20 45, 15 35, 25 25 C35 15, 40 20, 50 10"
                  fill="none"
                  stroke="var(--brand-green)"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-10 h-10 text-primary" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-primary">Success!</h1>
            <p className="text-muted-foreground mt-2">
              Your password has been reset successfully!
            </p>
          </div>

          <Button
            onClick={() => router.push("/login")}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-10 h-12 bg-primary rounded-full transform -rotate-12" />
            <div className="absolute top-1 right-0 w-4 h-4 bg-accent rounded-full" />
          </div>
          <span className="text-primary font-bold text-xl">Ajanah</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Kindly create a new password you can remember.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-10 pr-10 h-12 bg-white border-border"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pl-10 pr-10 h-12 bg-white border-border"
                {...register("confirmPassword")}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="h-5 w-5" /> : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
