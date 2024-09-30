import DashboardLayout from "@/features/app/dashboard/DashboardLayout";
import UserWorkspacePage from "@/features/user/UserWorkspacePage";
import { Navigate, RouteObject } from "react-router-dom";
import { DashboardErrorBoundary } from "@/features/app/dashboard/DashboardErrorBoundary";
import ManageBoards from "@/features/app/dashboard/Boards/ManageBoards";

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
        element: <div>Boards page</div>,
      },
      {
        path: "members",
        element: <div>Boards page</div>,
      },
      {
        path: "settings",
        element: <div>Boards page</div>,
      },
    ],
  },
];