"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { authAPI } from "@/lib/api-client"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSwitchToSignUp: () => void
}

export function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setApiError(null)
    try {
      const res = await authAPI.login({ email: data.email, password: data.password })
      if (!res.success || !res.data) {
        setApiError(res.error?.message ?? "Login failed. Please try again.")
        return
      }
      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
        setApiError("Cannot connect to server. Make sure the backend is running.")
      } else if (err instanceof Error) {
        setApiError(err.message)
      } else {
        setApiError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Welcome Back, <span className="text-primary">Ade</span>
        </h1>
        <p className="text-muted-foreground mt-2">Sign in to your event account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>

        {apiError && (
          <p className="text-sm text-destructive">{apiError}</p>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="h-5 w-5" /> : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-foreground font-semibold hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}
