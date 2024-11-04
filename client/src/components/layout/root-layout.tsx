import { Navigate } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { Home } from "@/features/home/components/home";

export const RootLayout = () => {
  const { data, isLoading } = useAuthUser();

  if (isLoading)
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return <Home />;
};
