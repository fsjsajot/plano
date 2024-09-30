import { Outlet, useParams } from "react-router-dom";

import { SidebarNav } from "@/components/SidebarNav";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWorkspaceData } from "../../../hooks/workspaces/useWorkspaceData";
import AppLayout from "../AppLayout";

export default function DashboardLayout() {
  const { workspaceId } = useParams();
  const { isLoading } = useWorkspaceData({
    id: workspaceId || "",
  });

  if (isLoading) return <LoadingSpinner className="w-10 h-10" />;

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
}
