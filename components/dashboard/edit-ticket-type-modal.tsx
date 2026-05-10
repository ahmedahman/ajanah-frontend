"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ticketsAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface TicketTypeDetail {
  id: string;
  name: string;
  price: any;
  capacity: number;
  sold: number;
  isFree: boolean;
  saleStartAt: string | null;
  saleEndAt: string | null;
  isVisible: boolean;
}

interface EditTicketTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ticketType: TicketTypeDetail | null;
}

function parseDecimal(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val);
  if (val && typeof val === "object" && "d" in val) {
    const dec = val as { s: number; e: number; d: number[] };
    return dec.s * (dec.d[0] ?? 0) * Math.pow(10, dec.e - (String(dec.d[0] ?? 0).length - 1));
  }
  return 0;
}

export function EditTicketTypeModal({
  isOpen,
  onClose,
  onSuccess,
  ticketType,
}: EditTicketTypeModalProps) {
  const [name, setName] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [saleStartAt, setSaleStartAt] = useState("");
  const [saleEndAt, setSaleEndAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketType) return;
    setName(ticketType.name);
    setIsFree(ticketType.isFree);
    setPrice(ticketType.isFree ? "" : String(parseDecimal(ticketType.price)));
    setCapacity(ticketType.capacity?.toString() ?? "");
    setSaleStartAt(
      ticketType.saleStartAt
        ? new Date(ticketType.saleStartAt).toISOString().slice(0, 16)
        : ""
    );
    setSaleEndAt(
      ticketType.saleEndAt
        ? new Date(ticketType.saleEndAt).toISOString().slice(0, 16)
        : ""
    );
    setError(null);
  }, [ticketType]);

  if (!isOpen || !ticketType) return null;

  const handleClose = () => {
    setError(null);
    setIsSaving(false);
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
      const res = await ticketsAPI.updateTicketType(DEFAULT_EVENT_ID, ticketType.id, {
        name,
        isFree,
        price: isFree ? 0 : parseFloat(price),
        capacity: capacity ? parseInt(capacity) : undefined,
        saleStartAt: saleStartAt ? new Date(saleStartAt).toISOString() : undefined,
        saleEndAt: saleEndAt ? new Date(saleEndAt).toISOString() : undefined,
      });
      if (res.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError((res.error as any)?.message ?? "Failed to update ticket type.");
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
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Edit Ticket Type</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter ticket type name"
              className="mt-2 h-10"
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsFree(true)}
                className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${
                  isFree
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`flex-1 h-10 rounded-md border text-sm font-medium transition-colors ${
                  !isFree
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                Paid
              </button>
            </div>
          </div>

          {/* Price — only when paid */}
          {!isFree && (
            <div>
              <label className="text-sm font-medium text-foreground">Price</label>
              <div className="flex items-center mt-2 border border-border rounded-md h-10 overflow-hidden">
                <span className="px-3 text-sm text-muted-foreground border-r border-border h-full flex items-center">
                  ₦
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-3 text-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* Capacity */}
          <div>
            <label className="text-sm font-medium text-foreground">Capacity</label>
            <Input
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter capacity"
              className="mt-2 h-10"
            />
          </div>

          {/* Sale Start */}
          <div>
            <label className="text-sm font-medium text-foreground">Sale Start</label>
            <input
              type="datetime-local"
              value={saleStartAt}
              onChange={(e) => setSaleStartAt(e.target.value)}
              className="mt-2 border border-border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring h-10"
            />
          </div>

          {/* Sale End */}
          <div>
            <label className="text-sm font-medium text-foreground">Sale End</label>
            <input
              type="datetime-local"
              value={saleEndAt}
              onChange={(e) => setSaleEndAt(e.target.value)}
              className="mt-2 border border-border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring h-10"
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
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
