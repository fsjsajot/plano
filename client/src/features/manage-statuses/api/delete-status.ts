import { useMutation, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Status } from "@/types/entities";

const deleteStatus = async ({
  workspaceId,
  statusId,
}: {
  workspaceId: number;
  statusId: number;
}) => {
  const response = await http.delete<Status>(
    `/api/workspaces/${workspaceId}/statuses/${statusId}`
  );

  return response.data;
};

interface UseDeleteStatusOptions {
  mutationConfig?: MutationConfig<typeof deleteStatus>;
}

export const useDeleteStatus = ({
  mutationConfig,
}: UseDeleteStatusOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restConfig,
    mutationFn: deleteStatus,

    onMutate: async (deletedStatus) => {
      await queryClient.cancelQueries({
        queryKey: ["workspace_statuses", deletedStatus.workspaceId],
      });

      const previousStatuses = queryClient.getQueryData([
        "workspace_statuses",
        deletedStatus.workspaceId,
      ]);

      queryClient.setQueryData<Status[]>(
        ["workspace_statuses", deletedStatus.workspaceId],
        (prev) => (prev || []).filter(({ id }) => id !== deletedStatus.statusId)
      );

      return { previousStatuses };
    },

    onSuccess: (...args) => successCallback?.(...args),

    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        ["workspace_statuses", variables.workspaceId],
        context?.previousStatuses
      );
    },
    onSettled: async (_data, _error, variables) => {
      return await queryClient.invalidateQueries({
        queryKey: ["workspace_statuses", variables.workspaceId],
      });
    },
  });
};
