import { http } from "@/lib/http";
import { Status } from "@/types/entities";
import { useQueryClient } from "@tanstack/react-query";

export const useStatuses = () => {
  const queryClient = useQueryClient();

  const createStatus = async <T>(workspaceId: string, values: T) => {
    const response = await http.post(
      `/api/workspaces/${workspaceId}/statuses`,
      values
    );

    queryClient.invalidateQueries({
      queryKey: ["workspace_statuses"],
    });

    return response.data;
  };

  const updateStatus = async <T>(
    workspaceId: string,
    statusId: string,
    values: T
  ) => {
    const response = await http.patch<Status>(
      `/api/workspaces/${workspaceId}/statuses/${statusId}`,
      values
    );

    return response.data;
  };

  const deleteStatus = async (workspaceId: string, statusId: string) => {
    const response = await http.delete(
      `/api/workspaces/${workspaceId}/statuses/${statusId}`
    );

    return response.data;
  };

  return {
    createStatus,
    updateStatus,
    deleteStatus,
  };
};
