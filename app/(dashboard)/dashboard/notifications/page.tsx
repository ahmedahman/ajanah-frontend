"use client";

import { useState } from "react";
import { Plus, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  description: string;
  audience: string;
  date: string;
  time: string;
  status: "sent" | "draft";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Event Starts Tomorrow!",
    description:
      "Get ready for an amazing experience at Tech Summit 2024. Check your schedule and plan your day.",
    audience: "All Attendees",
    date: "Nov 11, 2025",
    time: "10:00 AM",
    status: "sent",
  },
  {
    id: "2",
    title: "Keynote Starting in 30 Minutes",
    description:
      'Join us at the Main Stage for our opening keynote: "The Future of Technology" with John Smith.',
    audience: "All Attendees",
    date: "Nov 11, 2025",
    time: "10:00 AM",
    status: "sent",
  },
  {
    id: "3",
    title: "Event Starts Tomorrow!",
    description:
      "Get ready for an amazing experience at Tech Summit 2024. Check your schedule and plan your day.",
    audience: "All Attendees",
    date: "Nov 11, 2025",
    time: "10:00 AM",
    status: "sent",
  },
  {
    id: "4",
    title: "Event Starts Tomorrow!",
    description:
      "Get ready for an amazing experience at Tech Summit 2024. Check your schedule and plan your day.",
    audience: "All Attendees",
    date: "Nov 11, 2025",
    time: "10:00 AM",
    status: "sent",
  },
];

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Send updates and announcements to your attendees
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Push Notification CTA */}
      <div className="bg-primary text-white rounded-2xl p-6 flex items-center gap-4">
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

      {/* Notifications Grid */}
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
                    notification.status === "sent"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      notification.status === "sent"
                        ? "bg-primary"
                        : "bg-gray-400"
                    }`}
                  />
                  {notification.status === "sent" ? "Sent" : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-cyan-500 hover:text-cyan-600 font-medium text-sm transition-colors">
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
                {notification.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 inline-block">👥</span>
                {notification.audience}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 inline-block">📅</span>
                {notification.date}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 inline-block">⏰</span>
                {notification.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
