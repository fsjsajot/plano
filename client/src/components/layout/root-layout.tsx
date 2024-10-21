import { Navigate } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";

export const RootLayout = () => {
  const { data, isLoading } = useAuthUser();

  if (isLoading)
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  if (data) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Navigate to="/login" replace />;
};
