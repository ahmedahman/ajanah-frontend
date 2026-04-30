"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

  return (
    <div className="space-y-8">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-12 bg-secondary rounded-lg p-1">
          <TabsTrigger 
            value="signin" 
            className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm h-10"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger 
            value="signup"
            className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm h-10"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-8">
          <SignInForm onSwitchToSignUp={() => setActiveTab("signup")} />
        </TabsContent>

        <TabsContent value="signup" className="mt-8">
          <SignUpForm onSwitchToSignIn={() => setActiveTab("signin")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
