"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { speakersAPI } from "@/lib/api-client";

interface Speaker {
  id: string;
  name: string;
  company?: string;
  bio?: string;
  photo?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
  isVisible?: boolean;
  sessions?: unknown[];
}

interface EditSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  speaker: Speaker | null;
}

export function EditSpeakerModal({
  isOpen,
  onClose,
  onSuccess,
  speaker,
}: EditSpeakerModalProps) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (speaker) {
      setName(speaker.name ?? "");
      setTitle("");
      setCompany(speaker.company ?? "");
      setBio(speaker.bio ?? "");
      setError(null);
    }
  }, [speaker]);

  if (!isOpen || !speaker) return null;

  const handleClose = () => {
    setName("");
    setTitle("");
    setCompany("");
    setBio("");
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
      const res = await speakersAPI.updateSpeaker(speaker.id, {
        name,
        role: title,
        company,
        bio,
      });
      if (res.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(res.error?.message ?? "Failed to update speaker.");
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
          <h2 className="text-2xl font-bold text-foreground">Edit Speaker</h2>
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
              placeholder="Enter speaker name"
              className="mt-2 h-10"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CTO, Salesforce"
              className="mt-2 h-10"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Company
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp"
              className="mt-2 h-10"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter speaker bio"
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
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
