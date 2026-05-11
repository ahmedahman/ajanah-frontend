"use client"

import { useState, useEffect, useCallback } from "react"
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
import { checkInAPI, ticketsAPI, DEFAULT_EVENT_ID } from "@/lib/api-client"
import { CreateTicketTypeModal } from "@/components/dashboard/create-ticket-type-modal"
import { AttendeeDetailsModal } from "@/components/dashboard/attendee-details-modal"
import { EditTicketTypeModal } from "@/components/dashboard/edit-ticket-type-modal"

function parseDecimal(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val);
  if (val && typeof val === 'object' && 'd' in val) {
    const dec = val as { s: number; e: number; d: number[] };
    return dec.s * (dec.d[0] ?? 0) * Math.pow(10, dec.e - (String(dec.d[0] ?? 0).length - 1));
  }
  return 0;
}

interface TicketType {
  id: string;
  name: string;
  price: unknown;
  capacity: number;
  sold: number;
  isFree: boolean;
}

interface Attendee {
  id: string
  name: string
  ticketType: string
  status: string
  registration: string
  amount: string
  checkedInAt: string | null
}

interface CheckInStats {
  total: number
  checkedIn: number
  remaining: number
}

function formatRegistration(iso: string): string {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(2)
  return `${mm}/${dd}/${yy}`
}

type TabType = "attendees" | "ticket-types"

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("attendees")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateTicketTypeModalOpen, setIsCreateTicketTypeModalOpen] = useState(false)

  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [checkInStats, setCheckInStats] = useState<CheckInStats | null>(null)
  const [attendeesLoading, setAttendeesLoading] = useState(true)
  const [attendeesError, setAttendeesError] = useState<string | null>(null)

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [ticketTypesLoading, setTicketTypesLoading] = useState(true)
  const [ticketTypesError, setTicketTypesError] = useState<string | null>(null)

  const fetchTicketTypes = useCallback(() => {
    setTicketTypesLoading(true)
    setTicketTypesError(null)
    ticketsAPI.getTicketTypes(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          setTicketTypes(res.data as TicketType[])
        } else {
          setTicketTypesError(res.error?.message ?? "Failed to load ticket types.")
        }
      })
      .catch(() => setTicketTypesError("Cannot connect to server. Make sure the backend is running."))
      .finally(() => setTicketTypesLoading(false))
  }, [])

  useEffect(() => {
    setAttendeesLoading(true)
    setAttendeesError(null)

    Promise.all([
      ticketsAPI.getEventTickets(DEFAULT_EVENT_ID),
      checkInAPI.getEventStatus(DEFAULT_EVENT_ID),
    ])
      .then(([ticketsRes, statsRes]) => {
        if (ticketsRes.success && ticketsRes.data) {
          const mapped: Attendee[] = (ticketsRes.data as any[]).map((t: any) => ({
            id: t.id,
            name: t.user?.fullName ?? "—",
            ticketType: t.ticketType?.name ?? "—",
            status: t.checkedInAt ? "Checked In" : "Not Checked In",
            registration: t.createdAt ? formatRegistration(t.createdAt) : "—",
            amount: "—",
            checkedInAt: t.checkedInAt ?? null,
          }))
          setAttendees(mapped)
        } else {
          setAttendeesError(ticketsRes.error?.message ?? "Failed to load attendees.")
        }

        if (statsRes.success && statsRes.data) {
          const s = statsRes.data as any
          setCheckInStats({ total: s.total, checkedIn: s.checkedIn, remaining: s.remaining })
        }
      })
      .catch(() => setAttendeesError("Cannot connect to server. Make sure the backend is running."))
      .finally(() => setAttendeesLoading(false))

    fetchTicketTypes()
  }, [fetchTicketTypes])

  const statsData = [
    { label: "Total Attendees", value: attendeesLoading ? "…" : (checkInStats?.total.toLocaleString() ?? "–"), icon: CheckCircle2 },
    { label: "Checked In",      value: attendeesLoading ? "…" : (checkInStats?.checkedIn.toLocaleString() ?? "–"), icon: Users },
    { label: "Total Tickets",   value: attendeesLoading ? "…" : (checkInStats?.total.toLocaleString() ?? "–"), icon: Ticket },
    { label: "Tickets Sold",    value: attendeesLoading ? "…" : (checkInStats?.total.toLocaleString() ?? "–"), icon: CircleDollarSign },
  ]

  const filteredAttendees = attendees.filter(attendee =>
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
              Attendees ({attendeesLoading ? "…" : attendees.length})
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
              Ticket Types
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
              loading={attendeesLoading}
              error={attendeesError}
              onCheckIn={(ticketId, checkedInAt) => {
                setAttendees(prev => prev.map(a =>
                  a.id === ticketId ? { ...a, status: "Checked In", checkedInAt } : a
                ))
              }}
            />
          ) : (
            <TicketTypesView
              ticketTypes={ticketTypes}
              loading={ticketTypesLoading}
              error={ticketTypesError}
              onCreateTicket={() => setIsCreateTicketTypeModalOpen(true)}
              onRefresh={fetchTicketTypes}
            />
          )}
        </div>
      </div>
      <CreateTicketTypeModal
        isOpen={isCreateTicketTypeModalOpen}
        onClose={() => setIsCreateTicketTypeModalOpen(false)}
        onSuccess={() => fetchTicketTypes()}
      />
    </div>
  )
}

// Attendees View Component
interface AttendeesViewProps {
  attendees: Attendee[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  getTicketTypeBadgeColor: (ticketType: string) => string
  loading: boolean
  error: string | null
  onCheckIn: (ticketId: string, checkedInAt: string) => void
}

function AttendeesView({ attendees, searchQuery, setSearchQuery, getTicketTypeBadgeColor, loading, error, onCheckIn }: AttendeesViewProps) {
  const [viewingAttendee, setViewingAttendee] = useState<Attendee | null>(null)
  const [checkingInId, setCheckingInId] = useState<string | null>(null)
  const [checkInError, setCheckInError] = useState<string | null>(null)

  const handleCheckIn = async (attendee: Attendee) => {
    if (!window.confirm("Check in this attendee?")) return
    setCheckingInId(attendee.id)
    setCheckInError(null)
    const res = await checkInAPI.manualCheckIn(attendee.id)
    setCheckingInId(null)
    if (res.success) {
      onCheckIn(attendee.id, new Date().toISOString())
    } else {
      setCheckInError(res.error?.message ?? "Check-in failed.")
    }
  }

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

      {checkInError && (
        <p className="text-sm text-destructive">{checkInError}</p>
      )}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : attendees.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attendees yet.</p>
      ) : (
        /* Table */
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
                        <DropdownMenuItem onClick={() => setViewingAttendee(attendee)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {attendee.checkedInAt !== null ? (
                          <DropdownMenuItem disabled>Already Checked In</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            disabled={checkingInId === attendee.id}
                            onClick={() => handleCheckIn(attendee)}
                          >
                            {checkingInId === attendee.id ? "Checking in…" : "Check In"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AttendeeDetailsModal
        isOpen={viewingAttendee !== null}
        onClose={() => setViewingAttendee(null)}
        attendee={viewingAttendee}
      />
    </div>
  )
}

// Ticket Types View Component
interface TicketTypesViewProps {
  ticketTypes: TicketType[]
  loading: boolean
  error: string | null
  onCreateTicket: () => void
  onRefresh: () => void
}

function TicketTypesView({ ticketTypes, loading, error, onCreateTicket, onRefresh }: TicketTypesViewProps) {
  const [editingTicketType, setEditingTicketType] = useState<TicketType | null>(null)

  const handleDelete = async (ticket: TicketType) => {
    if (!window.confirm(`Are you sure you want to delete "${ticket.name}"?`)) return
    const res = await ticketsAPI.deleteTicketType(DEFAULT_EVENT_ID, ticket.id)
    if (res.success) {
      onRefresh()
    }
  }

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

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : ticketTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ticket types yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Capacity</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sold</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ticketTypes.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-foreground">{ticket.name}</td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {ticket.isFree ? "Free" : `₦${parseDecimal(ticket.price)}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{ticket.capacity}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{ticket.sold}</td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTicketType(ticket)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(ticket)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditTicketTypeModal
        isOpen={editingTicketType !== null}
        onClose={() => setEditingTicketType(null)}
        onSuccess={() => { onRefresh(); setEditingTicketType(null); }}
        ticketType={editingTicketType as any}
      />
    </div>
  )
}
