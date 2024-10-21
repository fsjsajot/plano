import { RouteObject } from "react-router-dom";
import { authRoutes } from "./auth";
import { appRoutes } from "./app";
import { WorkspaceInvite } from "@/features/workspace-invite/components/workspace-invite";
import { AppErrorBoundary } from "@/components/app-error-boundary/app-error-boundary";
import { RootLayout } from "@/components/layout/root-layout";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    errorElement: <AppErrorBoundary/>,
    children: [
      {
        path: "",
        index: true,
        element: <RootLayout />,
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
