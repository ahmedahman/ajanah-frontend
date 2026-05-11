"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAPI } from "@/lib/api-client";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ORGANIZER");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setFullName("");
    setEmail("");
    setRole("ORGANIZER");
    setIsSending(false);
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleSend = async () => {
    if (!fullName.trim() || !email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setError(null);
    setIsSending(true);
    try {
      const res = await adminAPI.inviteMember({ email, fullName, role });
      if (res.success) {
        setSuccessMsg("Invitation sent! They will receive a welcome email.");
        onSuccess?.();
        setTimeout(() => handleClose(), 1500);
      } else {
        if (res.error?.status === 409 || res.error?.message?.toLowerCase().includes("already exists")) {
          setError("A user with that email already exists.");
        } else {
          setError(res.error?.message ?? "Failed to send invitation.");
        }
      }
    } catch {
      setError("Failed to send invitation.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Invite Member</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="mt-2 h-10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="mt-2 h-10"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-foreground">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 border border-input rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring bg-white h-10"
            >
              <option value="ORGANIZER">Organizer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {successMsg && <p className="text-sm text-primary">{successMsg}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-white">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSending ? "Sending…" : "Send Invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
