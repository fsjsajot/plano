import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { ItemComment } from "@/types/entities";

export const formSchema = z.object({
  comment: z.string().min(1),
  parentId: z.number().optional(),
});

export type UpdateCommentPayload = z.infer<typeof formSchema>;

const updateComment = async ({
  workspaceId,
  boardId,
  itemId,
  commentId,
  data,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  commentId: number;
  data: UpdateCommentPayload;
}) => {
  const response = await http.patch<ItemComment>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/comments/${commentId}`,
    data
  );

  return response.data;
};

interface UseUpdateCommentOptions {
  mutationConfig?: MutationConfig<typeof updateComment>;
}

export const useUpdateComment = ({
  mutationConfig,
}: UseUpdateCommentOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateComment,
  });
};
