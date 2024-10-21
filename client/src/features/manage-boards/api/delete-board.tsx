import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types/entities";

const deleteBoard = async ({
  workspaceId,
  boardId,
}: {
  workspaceId: number;
  boardId: number;
}) => {
  const response = await http.delete<Board>(
    `/api/workspaces/${workspaceId}/boards/${boardId}`
  );

  return response.data;
};

interface UseDeleteBoardOptions {
  mutationConfig?: MutationConfig<typeof deleteBoard>;
}

export const useDeleteBoard = ({
  mutationConfig,
}: UseDeleteBoardOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: deleteBoard,
  });
};
