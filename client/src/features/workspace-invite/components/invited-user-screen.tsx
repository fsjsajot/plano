import { Navigate, useParams } from "react-router-dom";

import { useAuthUser } from "@/hooks/auth/useAuthUser";
import { useWorkspaceInvitedEmail } from "../api/get-workspace-invited-email";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const InvitedUserScreen = () => {
  const { workspaceId = "", token = "" } = useParams();
  const { isLoading, data: user } = useAuthUser();

  const { data: invite, isLoading: isInviteLoading } = useWorkspaceInvitedEmail(
    {
      workspaceId,
      token,
      email: user?.email || "",
      queryConfig: {
        throwOnError: true,
        enabled: !!user,
      },
    }
  );

  if (isLoading || isInviteLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect_to=/workspaces/${encodeURIComponent(
          workspaceId
        )}/invited/${encodeURIComponent(token)}`}
      />
    );
  }

  if (invite) {
    return <Navigate to={`/`} />;
  }

  return <></>;
};
