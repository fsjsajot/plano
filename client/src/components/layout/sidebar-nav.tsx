import { useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navbarItems } from "@/components/layout/navbar-items";
import { useWorkspaces } from "@/features/user-workspaces/api/get-workspaces";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingSpinner } from "../ui/loading-spinner";
import { SidebarItem } from "./sidebar-item";

export const SidebarNav = () => {
  const { pathname } = useLocation();
  const { workspaceId = "" } = useParams();
  const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspaces();

  const isActivePathStyle = useCallback(
    (href: string) => {
      if (pathname === href) return "default";

      return "ghost";
    },
    [pathname]
  );

  const links = useMemo(() => {
    if (workspaceId) {
      return navbarItems(workspaceId);
    }

    return [];
  }, [workspaceId]);

  return (
    <div className="flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        {links.map((link) => (
          <SidebarItem
            isActivePathStyle={isActivePathStyle}
            href={link.href}
            key={link.href}
          >
            {link.icon && <link.icon className="mr-2 h-4 w-4" />}
            {link.title}
          </SidebarItem>
        ))}
      </nav>
      <div className="px-2 mt-2">
        <h1 className="font-bold text-sm px-2">My Workspaces</h1>
        {isWorkspacesLoading && <LoadingSpinner />}

        {!isWorkspacesLoading && workspaces && (
          <ScrollArea className="px-2 h-64">
            {workspaces.map((workspace) => (
              <SidebarItem
                href={`/workspaces/${workspace.id}`}
                key={workspace.id}
                className={cn("w-full", {
                  "bg-accent": workspace.id === Number(workspaceId),
                })}
                title={workspace.name}
              >
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {workspace.name}
                </div>
              </SidebarItem>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
