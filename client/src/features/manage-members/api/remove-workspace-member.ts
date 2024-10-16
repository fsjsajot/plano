import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

const removeWorkspaceMember = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) => {
  const response = await http.delete(
    `/api/workspaces/${workspaceId}/members/${memberId}`
  );

  return response.data;
};

type UseRemoveWorkspaceMemberOptions = {
  mutationConfig?: MutationConfig<typeof removeWorkspaceMember>;
};

export const useRemoveWorkspaceMember = ({
  mutationConfig,
}: UseRemoveWorkspaceMemberOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      successCallback?.(...args);
    },
    ...restConfig,
    mutationFn: removeWorkspaceMember,
  });
};
