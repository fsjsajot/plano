import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Workspace } from "@/types/entities";
import { useWorkspaceMember } from "@/features/manage-members/api/get-workspace-member";
import { useAcceptWorkspaceInvite } from "../api/accept-workspace-invite";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

interface AuthenticatedInviteScreenProps {
  userId: number;
  workspace: Workspace;
  token: string;
}

export const AuthenticatedInviteScreen = ({
  userId,
  workspace,
  token,
}: AuthenticatedInviteScreenProps) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: member, isLoading: isMemberLoading } = useWorkspaceMember({
    workspaceId: workspace.id,
    memberId: userId,
    queryConfig: {
      staleTime: 60000,
    },
  });

  const { mutate: acceptWorkspaceInvite, isPending } = useAcceptWorkspaceInvite(
    {
      mutationConfig: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["workspace_members"],
          });
          navigate("/");
        },
      },
    }
  );

  useEffect(() => {
    if (member) {
      const interval = setInterval(() => {
        setCount((currentCount) => currentCount - 1);
      }, 1000);

      if (count === 0) {
        navigate("/", { replace: true });
      }

      return () => clearInterval(interval);
    }
  }, [count, member, navigate]);

  if (count === 0) return null;
  if (isMemberLoading) return <LoadingSpinner className="w-10 h-10" />;

  if (member && count > 0) {
    return (
      <div className="text-center">
        <p className="text-lg">
          You're already a member of
          <span className="font-bold ml-1">{workspace.name}</span> workspace.
        </p>

        <p className="text-lg">
          Redirecting you to homepage in
          <span className="font-bold ml-1">{count}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl leading-none">
        <span className="font-bold mr-1">{workspace.owner.name}</span>
        invites you to
        <span className="font-bold ml-1">{workspace.name}</span>
      </p>

      <Button
        size="lg"
        disabled={isPending}
        onClick={() =>
          acceptWorkspaceInvite({ token, workspaceId: workspace.id })
        }
      >
        {isPending ? (
          <span className="inline-flex items-center gap-1">
            <LoadingSpinner />
            Joining...
          </span>
        ) : (
          "Join Workspace"
        )}
      </Button>
    </div>
  );
};
