import { Link, useLocation, useParams } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { AuthenticatedInviteScreen } from "./authenticated-invite-screen";
import { useWorkspaceTokenInvite } from "../api/get-workspace-invite-token";

export const WorkspaceInvite = () => {
  const { workspaceId = "", token = "" } = useParams();

  const { data: user, isLoading: isUserLoading } = useAuthUser();

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
      </header>
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
