import { RouteObject } from "react-router-dom";
import { authRoutes } from "./auth";
import { appRoutes } from "./app";
import RootPage from "@/features/RootPage";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    children: [
      {
        path: "",
        index: true,
        element: <RootPage />,
      },

      authRoutes,
      ...appRoutes,
    ],
  },
];
