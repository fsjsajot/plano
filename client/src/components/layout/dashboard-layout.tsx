import { Outlet, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useWorkspace } from "@/features/manage-workspace/api/get-workspace";
import { AppLayout } from "@/components/layout/app-layout";

export const DashboardLayout = () => {
  const { workspaceId = "" } = useParams();
  const { isLoading: isWorkspaceLoading } = useWorkspace({
    workspaceId: Number(workspaceId),
  });

  if (isWorkspaceLoading)
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  return (
    <AppLayout>
      <div className="flex items-start min-w-full min-h-[calc(100dvh-3.5rem)]">
        <aside className="py-2 w-full max-w-64 min-h-[calc(100dvh-3.5rem)] top-14 border-r sticky">
          <SidebarNav />
        </aside>

        <Outlet />
      </div>
    </AppLayout>
  );
};
