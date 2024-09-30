import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import { Navigate } from "react-router-dom";

export default function RootPage() {
  const { data, isLoading } = useAuthUser();

  if (isLoading) return <LoadingSpinner className="w-10 h-10" />;

  if (data && data.redirect && location.pathname !== data.redirect) {
    console.log("to verify");
    return <Navigate to={data.redirect} replace />;
  }

  if (data && !data.redirect) {
    console.log("to dashboard");
    return <Navigate to="/workspaces" replace />;
  }

  return <Navigate to="/login" replace />;
}
