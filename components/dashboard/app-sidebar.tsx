"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Building2,
  UserCircle,
  FileText,
  Palette,
  Ticket,
  Gift,
  Bell,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    icon: MapPin,
    children: [
      { title: "Agenda", href: "/dashboard/agenda", icon: MapPin },
      { title: "Speakers", href: "/dashboard/speakers", icon: Users },
      { title: "Exhibitors", href: "/dashboard/exhibitors", icon: Building2 },
    ],
  },
  {
    title: "Profile Builder",
    icon: UserCircle,
    children: [
      {
        title: "General Information",
        href: "/dashboard/profile/general",
        icon: FileText,
      },
      { title: "Branding", href: "/dashboard/profile/branding", icon: Palette },
    ],
  },
  {
    title: "Tickets & Attendees",
    href: "/dashboard/tickets",
    icon: Ticket,
  },
  {
    title: "Sponsors",
    href: "/dashboard/sponsors",
    icon: Gift,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Content",
    "Profile Builder",
  ]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <img src="/ajanah-logo.svg" alt="Logo" className="w-6 h-6" />
            </div>
            <span className="text-primary font-bold text-lg">Ajanah</span>
          </Link>
        )}
        {isCollapsed && (
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-full"
          >
            <div className="relative">
              <div className="w-6 h-8 bg-primary rounded-full transform -rotate-12" />
              <div className="absolute top-0.5 right-0 w-2.5 h-2.5 bg-accent rounded-full" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => !isCollapsed && toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item)
                        ? "text-primary"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {openMenus.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!isCollapsed && openMenus.includes(item.title) && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-border">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ml-2",
                              isActive(child.href)
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                            )}
                          >
                            <child.icon className="h-4 w-4 shrink-0" />
                            <span>{child.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href!)
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          {isCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
