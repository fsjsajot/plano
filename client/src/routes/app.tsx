import { Navigate, RouteObject } from "react-router-dom";

import { InvitedUserScreen } from "@/features/workspace-invite/components/invited-user-screen";
import { ManageMembers } from "@/features/manage-members/components/manage-members";
import { ManageBoards } from "@/features/manage-boards/components/manage-boards";
import { ManageStatuses } from "@/features/manage-statuses/components/manage-statuses";
import UserWorkspacePage from "@/features/user-workspaces/components/user-workspaces";
import { ManageWorkspace } from "@/features/manage-workspace/components/manage-workspace";
import { AppErrorBoundary } from "@/components/app-error-boundary/app-error-boundary";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const appRoutes: RouteObject[] = [
  {
    path: "/workspaces",
    element: <UserWorkspacePage />,
    errorElement: <AppErrorBoundary />,
  },

  {
    path: "/workspaces/:workspaceId",
    element: <DashboardLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="boards" replace />,
      },
      {
        path: "boards",
        element: <ManageBoards />,
      },
      {
        path: "statuses",
        element: <ManageStatuses />,
      },
      {
        path: "members",
        element: <ManageMembers />,
      },
      {
        path: "settings",
        element: <ManageWorkspace />,
      },
    ],
  },

  {
    path: "/workspaces/:workspaceId/invited/:token",
    element: <InvitedUserScreen />,
    errorElement: <AppErrorBoundary />,
  },
];
