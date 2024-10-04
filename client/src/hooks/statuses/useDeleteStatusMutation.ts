import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStatuses } from "./useStatuses";
import { Status } from "@/types/entities";

interface MutationProps {
  onSuccessFn?: () => void;
}

export const useDeleteStatusMutation = ({ onSuccessFn } : MutationProps) => {
  const queryClient = useQueryClient();
  const { deleteStatus } = useStatuses();

  return useMutation({
    mutationFn: ({
      statusId,
      workspaceId,
    }: {
      workspaceId: string;
      statusId: string;
    }) => deleteStatus(workspaceId, statusId),

    onMutate: async (deletedStatus) => {
      await queryClient.cancelQueries({ queryKey: ["workspace_statuses"] });

      const previousStatuses = queryClient.getQueryData(["workspace_statuses"]);

      queryClient.setQueryData<Status[]>(["workspace_statuses"], (prev) =>
        (prev || []).filter(({ id }) => id !== deletedStatus.statusId)
      );

      return { previousStatuses };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["workspace_statuses"],
        context?.previousStatuses
      );
    },

    onSuccess: () => {
      onSuccessFn?.();
    },

    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["workspace_statuses"],
      });
    },
  });
};
