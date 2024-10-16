import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

const createWorkspaceInvite = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { inviteType: number; emails?: string[] };
}) => {
  const response = await http.post(
    `/api/workspaces/${workspaceId}/invites`,
    data
  );

  return response.data;
};

interface UseCreateWorkspaceInviteOptions {
  mutationConfig?: MutationConfig<typeof createWorkspaceInvite>;
}

export const useCreateWorkspaceInvite = ({
  mutationConfig,
}: UseCreateWorkspaceInviteOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createWorkspaceInvite,
  });
};
