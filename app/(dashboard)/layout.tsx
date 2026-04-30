"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-secondary/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
