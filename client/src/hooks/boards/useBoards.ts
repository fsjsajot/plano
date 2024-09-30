import { http } from "@/lib/http";
import { useQueryClient } from "@tanstack/react-query";

export const useBoards = () => {
  const queryClient = useQueryClient();

  const createBoard = async <T>(workspaceId: string, values: T) => {
    const response = await http.post(
      `/api/workspaces/${workspaceId}/boards`,
      values
    );

    queryClient.invalidateQueries({
      queryKey: ["workspace_boards", workspaceId],
    });

    return response.data;
  };

  const updateBoard = async <T>(
    workspaceId: string,
    boardId: string,
    values: T
  ) => {
    const response = await http.patch(
      `/api/workspaces/${workspaceId}/boards/${boardId}`,
      values
    );

    queryClient.invalidateQueries({
      queryKey: ["workspace_boards", workspaceId],
    });

    return response.data;
  };

  const deleteBoard = async (workspaceId: string, boardId: string) => {
    const response = await http.delete(
      `/api/workspaces/${workspaceId}/boards/${boardId}`
    );

    queryClient.invalidateQueries({
      queryKey: ["workspace_boards", workspaceId],
    });

    return response.data;
  };

  return {
    createBoard,
    updateBoard,
    deleteBoard,
  };
};
