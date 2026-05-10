"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTitle?: string;
  initialBody?: string;
}

export function BroadcastNotificationModal({
  isOpen,
  onClose,
  onSuccess,
  initialTitle,
  initialBody,
}: BroadcastNotificationModalProps) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [message, setMessage] = useState(initialBody ?? "");
  const [sendAt, setSendAt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [queuedCount, setQueuedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setSendAt("");
    setError(null);
    setSuccess(false);
    setQueuedCount(null);
    onClose();
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    setError(null);
    setIsSending(true);
    try {
      const payload = {
        title,
        body: message,
        ...(sendAt ? { scheduledFor: sendAt } : {}),
      };
      const res = await eventAPI.broadcast(
        DEFAULT_EVENT_ID,
        payload as { title: string; body: string },
      );
      if (res.success) {
        const returned = res.data as any;
        setQueuedCount(returned?.queued ?? 0);
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(res.error?.message ?? "Failed to send notification.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">
            Send Notification
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Notification Title */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Notification Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="mt-2 h-10"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              rows={4}
              className="mt-2 border rounded-md px-3 py-2 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Schedule for (optional)
            </label>
            <input
              type="datetime-local"
              value={sendAt}
              onChange={(e) => setSendAt(e.target.value)}
              className="mt-2 border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-primary">
              Notification queued for {queuedCount} recipient(s).
            </p>
          )}
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
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
