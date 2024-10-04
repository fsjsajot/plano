import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStatuses } from "./useStatuses";
import { Status } from "@/types/entities";

interface MutationProps {
  onSuccessFn?: () => void;
}

export const useUpdateStatusMutation = ({
  onSuccessFn,
}: MutationProps = {}) => {
  const queryClient = useQueryClient();
  const { updateStatus } = useStatuses();

  return useMutation({
    mutationFn: ({
      statusId,
      values,
      workspaceId,
    }: {
      workspaceId: string;
      statusId: string;
      values: Status;
    }) => updateStatus(workspaceId, statusId, values),

    onMutate: async (updatedStatus) => {
      await queryClient.cancelQueries({ queryKey: ["workspace_statuses"] });

      const previousStatuses = queryClient.getQueryData(["workspace_statuses"]);

      queryClient.setQueryData<Status[]>(["workspace_statuses"], (prev) => {
        return (prev || []).map((status) => {
          if (status.id === updatedStatus.statusId) {
            return updatedStatus.values;
          }

          return status;
        });
      });

      return { previousStatuses };
    },

    onSuccess: () => {
      onSuccessFn?.();
    },
    onError: (error, _variables, context) => {
      console.error(error);
      queryClient.setQueryData(
        ["workspace_statuses"],
        context?.previousStatuses
      );
    },

    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["workspace_statuses"],
      });
    },
  });
};
