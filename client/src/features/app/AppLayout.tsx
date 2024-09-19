import {
  Navigate,
  Outlet,
  useOutlet,
  useRouteLoaderData,
} from "react-router-dom";

export default function AppLayout() {
  const data = useRouteLoaderData("root");

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      App layout
      <Outlet />
    </div>
  );
}
