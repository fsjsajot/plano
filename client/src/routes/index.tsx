import { Outlet, RouteObject } from "react-router-dom";

import { AppErrorBoundary } from "@/components/app-error-boundary/app-error-boundary";
import { RootLayout } from "@/components/layout/root-layout";
import { Board } from "@/features/board/components/board";
import { CreatePost } from "@/features/board/components/create-post";
import { Home } from "@/features/home/components/home";
import { HomeContextProvder } from "@/features/home/components/home-context";
import { EditPost } from "@/features/post/components/edit-post";
import { Post } from "@/features/post/components/post";
import { WorkspaceInvite } from "@/features/workspace-invite/components/workspace-invite";
import { appRoutes } from "./app";
import { authRoutes } from "./auth";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    errorElement: <AppErrorBoundary />,
    children: [
      {
        path: "",
        index: true,
        element: <RootLayout />,
      },

      {
        path: "/app",
        element: (
          <HomeContextProvder>
            <Outlet />
          </HomeContextProvder>
        ),
        children: [
          {
            path: ":workspaceId",
            element: <Home />,
          },

          {
            path: ":workspaceId/boards/:boardId",
            element: <Board />,
          },

          {
            path: ":workspaceId/boards/:boardId/new",
            element: <CreatePost />,
          },

          {
            path: ":workspaceId/boards/:boardId/posts/:itemId",
            element: <Post />,
          },
          {
            path: ":workspaceId/boards/:boardId/posts/:itemId/edit",
            element: <EditPost />,
          },
        ],
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
