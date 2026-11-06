import {
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  IdCard,
  LayoutDashboard,
  ScanLine,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/roles";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  minRole: Role;
  /** Flip to true when the page is built. */
  ready: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Your home in NOVA.",
    icon: LayoutDashboard,
    minRole: "member",
    ready: true,
  },
  {
    href: "/dashboard/sessions",
    label: "Sessions",
    description: "Browse upcoming sessions and events.",
    icon: CalendarDays,
    minRole: "member",
    ready: true,
  },
  {
    label: "My Card",
    href: "/dashboard/my-card",
    icon: IdCard,
    minRole: "member",
    description: "See your card.",
    ready: true,
  },
  {
    href: "/dashboard/attendance",
    label: "My attendance",
    description: "See where you were present or absent.",
    icon: UserCheck,
    minRole: "member",
    ready: false,
  },
  {
    href: "/dashboard/scan",
    label: "Scan QR",
    description: "Check members in with the camera.",
    icon: ScanLine,
    minRole: "organizer",
    ready: true,
  },
  {
    href: "/dashboard/manual-checkin",
    label: "Manual check-in",
    description: "Mark attendance from the session roster.",
    icon: ClipboardCheck,
    minRole: "organizer",
    ready: true,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    description: "Attendance rates and participation.",
    icon: TrendingUp,
    minRole: "organizer",
    ready: false,
  },
  {
    href: "/dashboard/members",
    label: "Members",
    description: "Manage members, roles, and accounts.",
    icon: Users,
    minRole: "admin",
    ready: true,
  },
  {
    href: "/dashboard/members/cards",
    label: "Member cards",
    description: "Print NOVA cards with permanent QR codes.",
    icon: CreditCard,
    minRole: "admin",
    ready: true,
  },
];
