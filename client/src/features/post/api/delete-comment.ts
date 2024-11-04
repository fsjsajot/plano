import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { ItemComment } from "@/types/entities";

const deleteComment = async ({
  workspaceId,
  boardId,
  itemId,
  commentId,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  commentId: number;
}) => {
  const response = await http.delete<ItemComment>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/comments/${commentId}`
  );

  return response.data;
};

interface UseDeleteCommentOptions {
  mutationConfig?: MutationConfig<typeof deleteComment>;
}

export const useDeleteComment = ({
  mutationConfig,
}: UseDeleteCommentOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: deleteComment,
  });
};
