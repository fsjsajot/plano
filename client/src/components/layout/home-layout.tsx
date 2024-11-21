import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { AppHeader } from "./app-header";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../ui/button";

import { WorkspaceSwitcher } from "@/features/home/components/workspace-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AccountVerificationNotice } from "@/features/home/components/account-verification-notice";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useAuthUser();
  const { logout } = useAuth();

  const unverified = user && !user.emailVerifiedAt;

  if (isLoading)
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <AppHeader>
        <div className="flex justify-end w-full gap-2">
          <WorkspaceSwitcher />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="outline-none hover:bg-transparent border-none rounded-full p-0"
                >
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt="user avatar" />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={10}>
                <DropdownMenuLabel className="px-4">Account</DropdownMenuLabel>
                <div className="inline-flex gap-4 min-w-64 py-2 px-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt="user avatar" />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="inline-flex flex-col">
                    <div>{user.name}</div>
                    <div className="text-sm">{user.email}</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="px-4">
                  <Link to="/account_settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-4">
                  <Link to="/workspaces">Manage Workspaces</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="px-4">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </AppHeader>
      <main className={`flex-1 flex px-4 ${unverified ? "flex-col" : ""}`}>
        {!user.emailVerifiedAt && <AccountVerificationNotice user={user} />}
        {children}
      </main>
    </div>
  );
};
