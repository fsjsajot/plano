import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";

const acceptWorkspaceInvite = async ({
  workspaceId,
  token,
}: {
  workspaceId: string;
  token: string;
}) => {
  const response = await http.post(
    `/api/workspaces/${workspaceId}/invites/${token}/accept`
  );

  return response.data;
};

interface UseAcceptWorkspaceInviteOptions {
  mutationConfig?: MutationConfig<typeof acceptWorkspaceInvite>;
}

export const useAcceptWorkspaceInvite = ({
  mutationConfig,
}: UseAcceptWorkspaceInviteOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: acceptWorkspaceInvite,
  });
};
