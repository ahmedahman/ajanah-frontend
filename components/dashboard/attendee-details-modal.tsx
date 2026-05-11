"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Attendee {
  id: string;
  name: string;
  ticketType: string;
  status: string;
  registration: string;
  amount: string;
}

interface AttendeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: Attendee | null;
}

export function AttendeeDetailsModal({
  isOpen,
  onClose,
  attendee,
}: AttendeeDetailsModalProps) {
  if (!isOpen || attendee === null) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Attendee Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Full Name</p>
            <p className="text-sm text-muted-foreground mt-0.5">{attendee.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Ticket Type</p>
            <p className="text-sm text-muted-foreground mt-0.5">{attendee.ticketType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Status</p>
            <p className="text-sm text-muted-foreground mt-0.5">{attendee.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Registration Date</p>
            <p className="text-sm text-muted-foreground mt-0.5">{attendee.registration}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Amount</p>
            <p className="text-sm text-muted-foreground mt-0.5">{attendee.amount}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex p-6 border-t border-border sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
