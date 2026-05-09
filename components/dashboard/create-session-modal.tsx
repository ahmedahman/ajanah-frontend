"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { agendaAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateSessionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSessionModalProps) {
  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("TALK");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setSessionType("TALK");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setCapacity("");
    setDescription("");
    setIsSaving(false);
    setError(null);
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim() || !startTime || !endTime) {
      setError("Title, start time and end time are required.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const res = await agendaAPI.createSession({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        locationLabel: location,
        sessionType,
        capacity: capacity ? parseInt(capacity) : undefined,
        speakers: [],
        eventId: DEFAULT_EVENT_ID,
      });
      if (res.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(res.error?.message ?? "Failed to create session.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Add Session</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
              className="mt-2 h-10"
            />
          </div>

          {/* Session Type */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Session Type
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="TALK">Talk</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="PANEL">Panel</option>
              <option value="KEYNOTE">Keynote</option>
              <option value="BREAK">Break</option>
              <option value="NETWORKING">Networking</option>
            </select>
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Start Date &amp; Time <span className="text-destructive">*</span>
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* End Date & Time */}
          <div>
            <label className="text-sm font-medium text-foreground">
              End Date &amp; Time <span className="text-destructive">*</span>
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Stage"
              className="mt-2 h-10"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 200"
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter session description"
              rows={4}
              className="mt-2 border rounded-md px-3 py-2 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border shrink-0 bg-white">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
