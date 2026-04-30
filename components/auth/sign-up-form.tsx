"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, User, Phone, ChevronLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Step 1: Email only
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

// Step 2: Full registration
const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  countryCode: z.string().min(1, "Please select a country code"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  rememberMe: z.boolean().optional(),
})

type EmailFormData = z.infer<typeof emailSchema>
type RegistrationFormData = z.infer<typeof registrationSchema>

interface SignUpFormProps {
  onSwitchToSignIn: () => void
}

const countryCodes = [
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
]

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0])

  // Step 1 form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  // Step 2 form
  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+234",
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = registrationForm.watch("rememberMe")

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true)
    try {
      // Check if email exists (API integration point)
      console.log("[v0] Checking email:", data.email)
      await new Promise((resolve) => setTimeout(resolve, 800))
      registrationForm.setValue("email", data.email)
      setStep(2)
    } catch (error) {
      console.error("[v0] Email check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onRegistrationSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    try {
      // API integration point
      console.log("[v0] Registration data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Hello there,</h1>
          <p className="text-muted-foreground mt-2">
            Create a new account on Ajanah Event App
          </p>
        </div>

        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10 h-12 bg-white border-border"
                {...emailForm.register("email")}
                aria-invalid={emailForm.formState.errors.email ? "true" : "false"}
              />
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-foreground font-semibold underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/conditions" className="text-foreground font-semibold underline">
              conditions
            </Link>
          </p>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="h-5 w-5" /> : "Continue"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-foreground font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center gap-1 text-primary text-sm font-medium mb-4 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-4xl font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Enter your details to join the Ajanah Event App
        </p>
      </div>

      <form
        onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              className="h-12 bg-white border-border"
              {...registrationForm.register("firstName")}
              aria-invalid={
                registrationForm.formState.errors.firstName ? "true" : "false"
              }
            />
            {registrationForm.formState.errors.firstName && (
              <p className="text-sm text-destructive">
                {registrationForm.formState.errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              className="h-12 bg-white border-border"
              {...registrationForm.register("lastName")}
              aria-invalid={
                registrationForm.formState.errors.lastName ? "true" : "false"
              }
            />
            {registrationForm.formState.errors.lastName && (
              <p className="text-sm text-destructive">
                {registrationForm.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailFull">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="emailFull"
              type="email"
              placeholder="Enter your email address"
              className="pl-10 h-12 bg-white border-border"
              {...registrationForm.register("email")}
              aria-invalid={
                registrationForm.formState.errors.email ? "true" : "false"
              }
            />
          </div>
          {registrationForm.formState.errors.email && (
            <p className="text-sm text-destructive">
              {registrationForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-3 bg-white border-border flex items-center gap-2 min-w-[100px]"
                >
                  <span className="text-lg">{selectedCountryCode.flag}</span>
                  <span className="text-sm">{selectedCountryCode.code}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {countryCodes.map((country) => (
                  <DropdownMenuItem
                    key={country.code}
                    onClick={() => {
                      setSelectedCountryCode(country)
                      registrationForm.setValue("countryCode", country.code)
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm">
                      {country.code} ({country.country})
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              className="flex-1 h-12 bg-white border-border"
              {...registrationForm.register("phoneNumber")}
              aria-invalid={
                registrationForm.formState.errors.phoneNumber ? "true" : "false"
              }
            />
          </div>
          {registrationForm.formState.errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {registrationForm.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10 h-12 bg-white border-border"
              {...registrationForm.register("password")}
              aria-invalid={
                registrationForm.formState.errors.password ? "true" : "false"
              }
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
          {registrationForm.formState.errors.password && (
            <p className="text-sm text-destructive">
              {registrationForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMeSignup"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                registrationForm.setValue("rememberMe", checked as boolean)
              }
            />
            <Label
              htmlFor="rememberMeSignup"
              className="text-sm font-normal cursor-pointer"
            >
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

        <p className="text-sm text-muted-foreground text-center">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-foreground font-semibold underline">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/conditions" className="text-foreground font-semibold underline">
            conditions
          </Link>
        </p>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="h-5 w-5" /> : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-foreground font-semibold hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
