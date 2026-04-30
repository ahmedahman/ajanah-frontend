"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Plus, 
  Download,
  MoreHorizontal,
  CheckCircle2,
  Users,
  Ticket,
  CircleDollarSign,
  ArrowUpDown,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data for attendees
const attendeesData = [
  { id: 1, name: "ALICE JOHNSON", ticketType: "Student Pass", status: "Checked In", registration: "10/31/25", amount: "FREE" },
  { id: 2, name: "Bob Smith", ticketType: "General Pass", status: "Checked In", registration: "10/31/25", amount: "$20" },
  { id: 3, name: "Carol Williams", ticketType: "General Pass", status: "Not Checked In", registration: "10/31/25", amount: "$20" },
  { id: 4, name: "David Brown", ticketType: "Student Pass", status: "Checked In", registration: "10/31/25", amount: "FREE" },
  { id: 5, name: "Emma Davis", ticketType: "VIP Pass", status: "Not Checked In", registration: "10/31/25", amount: "$50" },
]

// Mock data for ticket types
const ticketTypesData = [
  { 
    id: 1, 
    name: "VIP Pass", 
    price: "$50", 
    sold: 124, 
    available: 26, 
    total: 150,
    revenue: "$6,200" 
  },
  { 
    id: 2, 
    name: "General Pass", 
    price: "$20", 
    sold: 543, 
    available: 157, 
    total: 700,
    revenue: "$11,348" 
  },
  { 
    id: 3, 
    name: "Student Pass", 
    price: "FREE", 
    sold: 91, 
    available: 107, 
    total: 198,
    revenue: "$0" 
  },
  { 
    id: 4, 
    name: "Early Bird", 
    price: "$15", 
    sold: 89, 
    available: 11, 
    total: 100,
    revenue: "$1,415" 
  },
]

// Stats data
const statsData = [
  { label: "Total Attendees", value: "2,145", icon: CheckCircle2 },
  { label: "Checked In", value: "1,743", icon: Users },
  { label: "Total Tickets", value: "2,500", icon: Ticket },
  { label: "Tickets Sold", value: "2,145", icon: CircleDollarSign },
]

type TabType = "attendees" | "ticket-types"

export default function TicketsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("attendees")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAttendees = attendeesData.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTicketTypeBadgeColor = (ticketType: string) => {
    switch (ticketType) {
      case "VIP Pass":
        return "bg-primary/10 text-primary border-primary/20"
      case "General Pass":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Student Pass":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tickets & Attendees</h1>
        <p className="text-primary mt-1">Manage registrations and track attendance</p>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {statsData.map((stat, index) => (
            <div key={index} className="px-6 first:pl-0 last:pr-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl border border-border">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("attendees")}
              className={cn(
                "px-6 py-4 text-sm font-medium transition-colors relative",
                activeTab === "attendees"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Attendees ({attendeesData.length})
              {activeTab === "attendees" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("ticket-types")}
              className={cn(
                "px-6 py-4 text-sm font-medium transition-colors relative",
                activeTab === "ticket-types"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Ticket Types ({ticketTypesData.length})
              {activeTab === "ticket-types" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "attendees" ? (
            <AttendeesView 
              attendees={filteredAttendees}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              getTicketTypeBadgeColor={getTicketTypeBadgeColor}
            />
          ) : (
            <TicketTypesView 
              ticketTypes={ticketTypesData}
              onCreateTicket={() => router.push("/dashboard/tickets/create")}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Attendees View Component
interface AttendeesViewProps {
  attendees: typeof attendeesData
  searchQuery: string
  setSearchQuery: (query: string) => void
  getTicketTypeBadgeColor: (ticketType: string) => string
}

function AttendeesView({ attendees, searchQuery, setSearchQuery, getTicketTypeBadgeColor }: AttendeesViewProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Attendee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Email All
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Attendee
                </div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Ticket Type
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Registration
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {attendee.name}
                </td>
                <td className="px-4 py-4">
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal", getTicketTypeBadgeColor(attendee.ticketType))}
                  >
                    {attendee.ticketType}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      attendee.status === "Checked In" ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-sm text-foreground">{attendee.status}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {attendee.registration}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  {attendee.amount}
                </td>
                <td className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>Check In</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Ticket Types View Component
interface TicketTypesViewProps {
  ticketTypes: typeof ticketTypesData
  onCreateTicket: () => void
}

function TicketTypesView({ ticketTypes, onCreateTicket }: TicketTypesViewProps) {
  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={onCreateTicket}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket Type
        </Button>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ticketTypes.map((ticket) => {
          const progressPercent = (ticket.sold / ticket.total) * 100
          
          return (
            <div 
              key={ticket.id} 
              className="bg-white rounded-xl border border-border p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{ticket.name}</h3>
                <p className="text-xl font-bold text-primary mt-1">{ticket.price}</p>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sold</span>
                  <span className="text-foreground">{ticket.sold} tickets</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="text-foreground">{ticket.available} tickets</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="text-primary font-semibold">{ticket.revenue}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
