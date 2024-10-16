import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

const disableWorkspaceInviteLink = async ({
  workspaceId,
  inviteId,
}: {
  workspaceId: string;
  inviteId: string;
}) => {
  const response = await http.delete(
    `/api/workspaces/${workspaceId}/invites/${inviteId}`
  );

  return response.data;
};

interface UseDisableWorkspaceInviteLinkOptions {
  mutationConfig?: MutationConfig<typeof disableWorkspaceInviteLink>;
}

export const useDisableWorkspaceInviteLink = ({
  mutationConfig,
}: UseDisableWorkspaceInviteLinkOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: disableWorkspaceInviteLink,
  });
};
