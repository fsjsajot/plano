import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Status } from "@/types/entities";

export const formSchema = z.object({
  name: z.string().min(1),
  visibility: z.boolean().default(true),
});

export type UpdateStatusPayload = z.infer<typeof formSchema>;

const updateStatus = async ({
  workspaceId,
  data,
  statusId,
}: {
  workspaceId: number;
  statusId: number;
  data: Status;
}) => {
  const response = await http.patch<Status>(
    `/api/workspaces/${workspaceId}/statuses/${statusId}`,
    data
  );

  return response.data;
};

interface UseUpdateStatusOptions {
  mutationConfig?: MutationConfig<typeof updateStatus>;
}

export const useUpdateStatus = ({
  mutationConfig,
}: UseUpdateStatusOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restConfig, // TODO: currently values pass to this hook will never be used, still checking how to make typescript happy with existing callback containing context entries
    mutationFn: updateStatus,

    onMutate: async (updatedStatus) => {
      await queryClient.cancelQueries({
        queryKey: [
          "workspace_statuses",
          updatedStatus.workspaceId,
          false,
          false,
        ],
      });

      const previousStatuses = queryClient.getQueryData([
        "workspace_statuses",
        updatedStatus.workspaceId,
      ]);

      queryClient.setQueryData<Status[]>(
        ["workspace_statuses", updatedStatus.workspaceId, false, false],

        (prev) => {
          return (prev || []).map((status) => {
            if (status.id === Number(updatedStatus.statusId)) {
              return updatedStatus.data;
            }

            return status;
          });
        }
      );

      return { previousStatuses };
    },

    onSuccess: (...args) => successCallback?.(...args),

    onError: (error, variables, context) => {
      console.error(error);
      queryClient.setQueryData(
        ["workspace_statuses", variables.workspaceId, false, false],
        context?.previousStatuses
      );
    },

    onSettled: async (_data, _error, variables) => {
      return await queryClient.invalidateQueries({
        queryKey: ["workspace_statuses", variables.workspaceId, false, false],
      });
    },
  });
};
