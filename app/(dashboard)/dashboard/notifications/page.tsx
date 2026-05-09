"use client";

import { useState, useEffect } from "react";
import { Plus, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationsAPI } from "@/lib/api-client";
import { BroadcastNotificationModal } from "@/components/dashboard/broadcast-notification-modal";

interface ApiNotification {
  id: string;
  title: string;
  body: string;
  status: "PENDING" | "SENT" | "FAILED";
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    notificationsAPI.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data);
        } else {
          setError(res.error?.message ?? "Failed to load notifications.");
        }
      })
      .catch(() => setError("Cannot connect to server. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [refreshCount]);

  const handleMarkRead = async (notificationId: string) => {
    const res = await notificationsAPI.markRead(notificationId);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, status: "SENT" as const } : n))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Send updates and announcements to your attendees
          </p>
        </div>
        <Button
          onClick={() => setShowBroadcastModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Push Notification CTA */}
      <div
        onClick={() => setShowBroadcastModal(true)}
        className="bg-primary text-white rounded-2xl p-6 flex items-center gap-4 cursor-pointer"
      >
        <div className="p-3 bg-white/20 rounded-full">
          <MessageCircle className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Send Push Notification</h3>
          <p className="text-white/90 text-sm">
            Instant message to all attendees
          </p>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Notifications Grid */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !error && notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      notification.status === "SENT"
                        ? "bg-secondary text-foreground"
                        : notification.status === "FAILED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        notification.status === "SENT"
                          ? "bg-gray-400"
                          : notification.status === "FAILED"
                            ? "bg-destructive"
                            : "bg-primary"
                      }`}
                    />
                    {notification.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    disabled={notification.status === "SENT"}
                    className="text-cyan-500 hover:text-cyan-600 font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    View
                  </button>
                  <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
                    Duplicate
                  </button>
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-4">
                <h3 className="font-bold text-foreground mb-2">
                  {notification.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notification.body}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block">👥</span>
                  All Attendees
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block">📅</span>
                  {formatDate(notification.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 inline-block">⏰</span>
                  {formatTime(notification.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <BroadcastNotificationModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSuccess={() => setRefreshCount((c) => c + 1)}
      />
    </div>
  );
}
