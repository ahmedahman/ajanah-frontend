"use client"

import { useState, useEffect } from "react"
import {
  Users,
  UserCheck,
  Mic2,
  Building2,
  Plus,
  ArrowUpRight,
  Calendar,
  Bell,
  Gift,
  Users2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckInsChart } from "@/components/dashboard/check-ins-chart"
import { dashboardAPI, eventAPI, DEFAULT_EVENT_ID, type DashboardStats } from "@/lib/api-client"

const quickActions = [
  {
    title: "Sessions & agenda",
    description: "Manage time slots, venues, and live session syncing for all tracks.",
    icon: Calendar,
    action: "Add session",
    href: "/dashboard/agenda",
  },
  {
    title: "Exhibitors",
    description: "Onboard partners and assign booth locations in the main hall.",
    icon: Building2,
    action: "Add exhibitor",
    href: "/dashboard/exhibitors",
  },
  {
    title: "Speakers",
    description: "Review bios, presentation slides, and technical requirements.",
    icon: Users2,
    action: "Add speaker",
    href: "/dashboard/speakers",
  },
  {
    title: "Sponsorship",
    description: "Track tier fulfillment, brand placements, and lead generation stats.",
    icon: Gift,
    action: "View details",
    href: "/dashboard/sponsors",
  },
  {
    title: "Notifications and alerts",
    description: "Push real-time updates to the attendee app for schedule changes or emergency safety broadcasts.",
    icon: Bell,
    action: "View details",
    href: "/dashboard/notifications",
    urgent: 3,
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventTitle, setEventTitle] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      dashboardAPI.getDashboard(),
      eventAPI.getDetail(DEFAULT_EVENT_ID),
    ]).then(([dashRes, eventRes]) => {
      if (dashRes.success && dashRes.data) {
        setStats(dashRes.data)
      } else {
        setError(dashRes.error?.message ?? "Failed to load dashboard data.")
      }
      if (eventRes.success && eventRes.data) {
        setEventTitle(eventRes.data.title)
      }
    })
    .catch(() => setError("Cannot connect to server. Make sure the backend is running."))
    .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: "Total Participants", value: loading ? "…" : (stats?.totalUsers.toLocaleString() ?? "–"), icon: Users, color: "text-primary" },
    { label: "Check-ins Today", value: loading ? "…" : (stats?.dau.toLocaleString() ?? "–"), icon: UserCheck, color: "text-primary" },
    { label: "Speakers", value: "–", icon: Mic2, color: "text-primary" },
    { label: "Exhibitors", value: "–", icon: Building2, color: "text-primary" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{eventTitle ?? "GiTex Nigeria 2025"}</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Invite member
        </Button>
      </div>

      {/* Stats cards */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Check-ins Overview */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold">Check-ins Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time attendance metrics across event duration
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary font-medium">Live tracking</span>
            </div>
            <span className="text-sm text-muted-foreground">Real-time (Last 24h)</span>
          </div>
        </CardHeader>
        <CardContent>
          <CheckInsChart />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="bg-white relative">
              {action.urgent && (
                <span className="absolute top-4 right-4 bg-destructive/10 text-destructive text-xs font-medium px-2 py-1 rounded-full">
                  {action.urgent} URGENT
                </span>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <action.icon className="h-5 w-5 text-foreground" />
                  </div>
                  {!action.urgent && (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {action.description}
                </p>
                <Button
                  variant={action.action === "View details" ? "outline" : "default"}
                  className={
                    action.action === "View details"
                      ? "w-full border-primary text-primary hover:bg-primary/5"
                      : "w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  }
                >
                  {action.action.startsWith("Add") && <Plus className="h-4 w-4 mr-2" />}
                  {action.action.startsWith("Add") && action.title === "Speakers" && (
                    <Users2 className="h-4 w-4 mr-2" />
                  )}
                  {action.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
