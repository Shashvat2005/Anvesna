// src/components/layout/AppShell.tsx
"use client";

import type React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  HeartPulse,
  BookOpen,
  UserCircle2,
  LogOut,
  LifeBuoy,
  ShieldAlert as IconShieldAlert,
  CloudRain,
  Sunrise,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

interface NavItem {
  href?: string;
  label?: string;
  icon?: React.ComponentType;
  type?: "divider" | "header";
  key?: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mood-tracking", label: "Mood Tracking", icon: HeartPulse },
  { href: "/chat", label: "AI Companion", icon: MessageCircle },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/community", label: "Communities Hub", icon: Users },
  { type: "divider", key: "div1" },
  { type: "header", label: "Support Sections", key: "header1" },
  { href: "/addiction-support", label: "Addiction Support", icon: LifeBuoy },
  { href: "/anxiety-support", label: "Anxiety Support", icon: IconShieldAlert },
  { href: "/depression-support", label: "Depression Support", icon: CloudRain },
  { href: "/self-growth-support", label: "Self-Growth", icon: Sunrise },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Logo textSize="text-xl" iconSize={24} />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => {
              if (item.type === "divider") {
                return (
                  <SidebarMenuItem key={item.key || "divider"} className="my-1">
                    <hr className="border-sidebar-border" />
                  </SidebarMenuItem>
                );
              }
              if (item.type === "header") {
                return (
                  <SidebarMenuItem key={item.key || "header"} className="px-2 py-1 mt-2">
                    <span className="text-xs font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                    <span className="group-data-[collapsible=icon]:block group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:my-2 h-[1px] w-full bg-sidebar-border hidden" />
                  </SidebarMenuItem>
                );
              }
              return (
                <SidebarMenuItem key={item.href || "default"}>
                  <Link href={item.href || "#"} legacyBehavior passHref>
                    <SidebarMenuButton
                      // isActive={
                      //   pathname === item.href ||
                      //   (item.href && pathname.startsWith(item.href))
                      // }
                      tooltip={item.label || ""}
                      aria-label={item.label || ""}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/profile" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/profile"}
                  tooltip="Profile"
                  aria-label="Profile"
                >
                  <UserCircle2 />
                  <span>Profile</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Log Out" aria-label="Log Out">
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">{/* Could add breadcrumbs or page title here */}</div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">{children}</main>
        <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Anvesna. All rights reserved. This is a support tool, not a clinical product.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
