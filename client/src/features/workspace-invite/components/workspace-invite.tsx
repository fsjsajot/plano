import { Link, useLocation, useParams } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { AuthenticatedInviteScreen } from "./authenticated-invite-screen";
import { useWorkspaceTokenInvite } from "../api/get-workspace-invite-token";
import { AppHeader } from "@/components/layout/app-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const WorkspaceInvite = () => {
  const { workspaceId = "", token = "" } = useParams();

  const { logout } = useAuth();
  const { data: user, isLoading: isUserLoading } = useAuthUser({
    shouldRedirect: false,
  });

  const { data: tokenInvite, isLoading: isTokenInviteLoading } =
    useWorkspaceTokenInvite({
      workspaceId,
      token,
      queryConfig: {
        throwOnError: true,
      },
    });

  if (isTokenInviteLoading || isUserLoading)
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );

  if (!tokenInvite) {
    throw new Error("Invite not found.");
  }

  const { pathname } = useLocation();

  return (
    <div className="flex flex-col w-full min-h-dvh">
      <AppHeader>
        <div className="flex justify-end w-full gap-2">
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
      <main className="flex-1">
        <div className=" min-w-full min-h-[calc(100dvh-3.5rem)]">
          <div className="flex justify-start flex-col min-h-[inherit] p-32 gap-4  items-center w-full">
            {user ? (
              <AuthenticatedInviteScreen
                userId={user.id}
                workspace={tokenInvite.workspace}
                token={token}
              />
            ) : (
              <>
                <p className="text-xl leading-none">
                  <span className="font-bold mr-1">
                    {tokenInvite.workspace.owner.name}
                  </span>
                  invites you to
                  <span className="font-bold ml-1">
                    {tokenInvite.workspace.name}
                  </span>
                </p>
                <div className="flex gap-4 p-4">
                  <Link
                    to={`/register?redirect_to=${pathname}`}
                    className={buttonVariants({ size: "lg" })}
                  >
                    Register
                  </Link>
                  <Link
                    to={`/login?redirect_to=${pathname}`}
                    className={buttonVariants({
                      size: "lg",
                      variant: "secondary",
                    })}
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
