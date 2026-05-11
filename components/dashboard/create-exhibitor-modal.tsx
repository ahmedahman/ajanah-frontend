"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exhibitorsAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface CreateExhibitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateExhibitorModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateExhibitorModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [boothNumber, setBoothNumber] = useState("");
  const [boothLocation, setBoothLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setContactEmail("");
    setContactPhone("");
    setBoothNumber("");
    setBoothLocation("");
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
      const res = await exhibitorsAPI.createExhibitor(DEFAULT_EVENT_ID, {
        name,
        description,
        website: website,
        contactEmail,
        contactPhone,
        boothNumber,
        boothLocation,
        categories: [],
      });
      console.log("createExhibitor response:", res);
      if (res.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(res.error?.message ?? JSON.stringify(res));
      }
    } catch (err) {
      console.error("createExhibitor error:", err);
      setError("Cannot connect to server.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Add Exhibitor</h2>
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
              placeholder="Enter exhibitor name"
              className="mt-2 h-10"
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
              placeholder="Enter exhibitor description"
              rows={4}
              className="mt-2 border rounded-md px-3 py-2 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Website */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Website
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="mt-2 h-10"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Contact Email
            </label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Enter contact email"
              className="mt-2 h-10"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Contact Phone
            </label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Enter contact phone"
              className="mt-2 h-10"
            />
          </div>

          {/* Booth Number */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Booth Number
            </label>
            <Input
              value={boothNumber}
              onChange={(e) => setBoothNumber(e.target.value)}
              placeholder="e.g. B12"
              className="mt-2 h-10"
            />
          </div>

          {/* Booth Location */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Booth Location
            </label>
            <Input
              value={boothLocation}
              onChange={(e) => setBoothLocation(e.target.value)}
              placeholder="e.g. Hall B, Row 3"
              className="mt-2 h-10"
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
