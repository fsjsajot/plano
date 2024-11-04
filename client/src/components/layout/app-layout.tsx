import React from "react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { AppHeader } from "./app-header";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useAuthUser();
  const { logout } = useAuth();

  if (isLoading)
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <AppHeader>
        {data && (
          <div className="flex justify-end w-full">
            <Button onClick={logout} variant="ghost">
              Logout
            </Button>
          </div>
        )}
      </AppHeader>
      <main className="flex-1 flex">{children}</main>
    </div>
  );
};
