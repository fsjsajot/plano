import { RouteObject } from "react-router-dom";
import { authRoutes } from "./auth";
import { appRoutes } from "./app";
import RootPage from "@/features/RootPage";
import { WorkspaceInvite } from "@/features/workspace-invite/components/workspace-invite";
import { DashboardErrorBoundary } from "@/features/app/dashboard/DashboardErrorBoundary";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    errorElement: <DashboardErrorBoundary/>,
    children: [
      {
        path: "",
        index: true,
        element: <RootPage />,
      },

      authRoutes,
      ...appRoutes,

      {
        path: "/invite/:workspaceId/:token",
        element: <WorkspaceInvite />,
      },
    ],
  },
];
