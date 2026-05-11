"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgendaSession {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  session_date?: string;
  room?: string;
  location_label?: string;
  session_type?: string;
  capacity?: number;
  speakers?: unknown[];
  is_bookmarked?: boolean;
  day?: string;
}

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AgendaSession | null;
}

function formatTime(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const fields: { label: string; value: (s: AgendaSession) => string | number }[] = [
  { label: "Title", value: (s) => s.title },
  { label: "Type", value: (s) => s.session_type ?? "—" },
  { label: "Date", value: (s) => s.session_date ?? "—" },
  { label: "Day", value: (s) => s.day ?? "—" },
  { label: "Start Time", value: (s) => formatTime(s.start_time) },
  { label: "End Time", value: (s) => formatTime(s.end_time) },
  { label: "Room", value: (s) => s.room ?? "—" },
  { label: "Location", value: (s) => s.location_label ?? "—" },
  { label: "Capacity", value: (s) => s.capacity ?? "—" },
  { label: "Description", value: (s) => s.description ?? "—" },
];

export function SessionDetailsModal({
  isOpen,
  onClose,
  session,
}: SessionDetailsModalProps) {
  if (!isOpen || session === null) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Session Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{value(session)}</p>
            </div>
          ))}
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
