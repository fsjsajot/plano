import React from "react";
import { Link, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";

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
      <header className="z-10 sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            plano
            <span className="sr-only">Acme Inc</span>
          </Link>
        </nav>

        {data && (
          <div className="flex justify-end w-full">
            <Button onClick={logout} variant="ghost">
              Logout
            </Button>
          </div>
        )}
      </header>
      <main className="flex-1 flex">{children}</main>
    </div>
  );
};
