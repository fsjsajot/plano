import { Chalkboard, Gear, TrendUp, UserList } from "@phosphor-icons/react";

export interface NavbarItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const navbarItems = (id: string) : NavbarItem[] => {
  
  return [
  {
    title: "Boards",
    href: `/workspaces/${id}/boards`,
    icon: Chalkboard,
  },
  {
    title: "Statuses",
    href: `/workspaces/${id}/statuses`,
    icon: TrendUp,
  },
  {
    title: "Members",
    href: `/workspaces/${id}/members`,
    icon: UserList,
  },
  {
    title: "Settings",
    href: `/workspaces/${id}/settings`,
    icon: Gear,
  },
]
};