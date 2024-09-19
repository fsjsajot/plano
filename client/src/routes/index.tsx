import { Navigate, RouteObject } from "react-router-dom";
import { authRoutes } from "./auth";

export const routes: RouteObject[] = [
  {
    id: "root",
    children: [
      {
        path: "/",
        index: true,
        element: <Navigate to="/login" replace />,
      },

      authRoutes,
    ],
  },
];
