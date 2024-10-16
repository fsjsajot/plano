import DashboardLayout from "@/features/app/dashboard/DashboardLayout";
import UserWorkspacePage from "@/features/user/UserWorkspacePage";
import { Navigate, RouteObject } from "react-router-dom";
import { DashboardErrorBoundary } from "@/features/app/dashboard/DashboardErrorBoundary";
import ManageBoards from "@/features/app/dashboard/boards/ManageBoards";
import ManageStatuses from "@/features/app/dashboard/statuses/manage-statuses";
import { ManageWorkspace } from "@/features/app/dashboard/manage-workspace";

import { InvitedUserScreen } from "@/features/workspace-invite/components/invited-user-screen";
import { ManageMembers } from "@/features/manage-members/components/manage-members";

export const appRoutes: RouteObject[] = [
  {
    path: "/workspaces",
    element: <UserWorkspacePage />,
    errorElement: <DashboardErrorBoundary />,
  },

  {
    path: "/workspaces/:workspaceId",
    element: <DashboardLayout />,
    errorElement: <DashboardErrorBoundary />,
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
    errorElement: <DashboardErrorBoundary />,
  },
];
