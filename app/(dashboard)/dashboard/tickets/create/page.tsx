"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { ticketsAPI, DEFAULT_EVENT_ID } from "@/lib/api-client"

interface TicketFormData {
  ticketName: string
  startDate: string
  endDate: string
  quantity: number
  ticketType: "free" | "paid"
  showLabel: boolean
  label: string
}

export default function CreateTicketPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<TicketFormData>({
    ticketName: "",
    startDate: "",
    endDate: "",
    quantity: 0,
    ticketType: "free",
    showLabel: true,
    label: "Free",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const handleInputChange = (field: keyof TicketFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TicketFormData, string>> = {}

    if (!formData.ticketName.trim()) {
      newErrors.ticketName = "Ticket name is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date"
    }
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity must be 0 or greater"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setApiError(null)

    setApiError('Ticket type creation is not yet available — backend endpoint pending.');
    setIsSubmitting(false);
    return;
  }

  const handleCancel = () => {
    router.push("/dashboard/tickets")
  }

  // Format date for preview
  const formattedEndDate = useMemo(() => {
    if (!formData.endDate) return "Tue, 28th April, 2026"
    const date = new Date(formData.endDate)
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    return date.toLocaleDateString('en-US', options)
  }, [formData.endDate])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create a Ticket</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        {/* Basics Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Basics</h2>
              <p className="text-sm text-primary mt-1">
                Tickets will be available during the specified dates. Hidden tickets can be accessed via a direct registration link or selected within Studio.
              </p>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              {/* Ticket Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <span className="text-destructive">*</span>Ticket name
                </Label>
                <Input
                  type="text"
                  placeholder="Ticket name"
                  value={formData.ticketName}
                  onChange={(e) => handleInputChange("ticketName", e.target.value)}
                  className={cn(errors.ticketName && "border-destructive")}
                />
                {errors.ticketName && (
                  <p className="text-xs text-destructive">{errors.ticketName}</p>
                )}
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <span className="text-destructive">*</span>Start date
                  </Label>
                  <Input
                    type="date"
                    placeholder="dd/mm/yy"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className={cn(errors.startDate && "border-destructive")}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <span className="text-destructive">*</span>End date
                  </Label>
                  <Input
                    type="date"
                    placeholder="dd/mm/yy"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className={cn(errors.endDate && "border-destructive")}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2 max-w-xs">
                <Input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                  className={cn(errors.quantity && "border-destructive")}
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive">{errors.quantity}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Type Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Ticket</h2>
              <p className="text-sm text-primary mt-1">Ticket_type_description</p>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              {/* Ticket Type Toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  <span className="text-destructive">*</span>Ticket name
                </Label>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => handleInputChange("ticketType", "free")}
                    className={cn(
                      "px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                      formData.ticketType === "free"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("ticketType", "paid")}
                    className={cn(
                      "px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                      formData.ticketType === "paid"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    )}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {/* Show Label Toggle */}
              <div className="flex items-center justify-between max-w-md">
                <Label className="text-sm font-medium">Show Label</Label>
                <Switch
                  checked={formData.showLabel}
                  onCheckedChange={(checked) => handleInputChange("showLabel", checked)}
                />
              </div>

              {/* Label Input */}
              {formData.showLabel && (
                <div className="space-y-2 max-w-md">
                  <Label className="text-sm font-medium text-muted-foreground">Label</Label>
                  <Input
                    type="text"
                    placeholder="Free"
                    value={formData.label}
                    onChange={(e) => {
                      if (e.target.value.length <= 40) {
                        handleInputChange("label", e.target.value)
                      }
                    }}
                    maxLength={40}
                  />
                  <p className="text-xs text-muted-foreground">{formData.label.length}/40 characters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Preview Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Ticket Preview</h2>
              <p className="text-sm text-primary mt-1">
                View how the ticket appears to registrants
              </p>
            </div>

            {/* Right Column - Preview Card */}
            <div className="lg:col-span-8">
              <div className="bg-muted/30 rounded-xl border border-border p-6 max-w-md">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {formData.ticketName || "Ticket name"}
                  </h3>
                  {formData.showLabel && formData.label && (
                    <p className="text-base font-semibold text-foreground">
                      {formData.label}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Available until {formattedEndDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-col items-end gap-3">
          {apiError && <p className="text-xs text-destructive">{apiError}</p>}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-muted text-muted-foreground hover:bg-muted/80 min-w-[120px]"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
