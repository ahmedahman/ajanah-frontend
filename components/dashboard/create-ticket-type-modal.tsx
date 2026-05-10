"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ticketsAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface CreateTicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateTicketTypeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketTypeModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setPrice(0);
    setCapacity(0);
    setIsFree(false);
    setIsSaving(false);
    setError(null);
    onClose();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const res = await ticketsAPI.createTicketType(DEFAULT_EVENT_ID, {
        name,
        price: isFree ? 0 : price,
        capacity,
        isFree,
      });
      if (res.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(res.error?.message ?? "Failed to create ticket type.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Create Ticket Type</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. General Admission"
              className="mt-2 h-10"
            />
          </div>

          {/* Is Free */}
          <div className="flex items-center gap-3">
            <input
              id="isFree"
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <label htmlFor="isFree" className="text-sm font-medium text-foreground">
              Free ticket
            </label>
          </div>

          {/* Price — hidden when isFree */}
          {!isFree && (
            <div>
              <label className="text-sm font-medium text-foreground">Price (₦)</label>
              <Input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                className="mt-2 h-10"
              />
            </div>
          )}

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-foreground">Capacity</label>
            <Input
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              placeholder="0"
              className="mt-2 h-10"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-white">
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
