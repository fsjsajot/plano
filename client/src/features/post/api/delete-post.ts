import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { BoardItem } from "@/types/entities";

const deletePost = async ({
  workspaceId,
  boardId,
  itemId,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
}) => {
  const response = await http.delete<BoardItem>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}`
  );

  return response.data;
};

interface UseDeletePostOptions {
  mutationConfig?: MutationConfig<typeof deletePost>;
}

export const useDeletePost = ({
  mutationConfig,
}: UseDeletePostOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: deletePost,
  });
};
