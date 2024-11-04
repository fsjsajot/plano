import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { ItemComment } from "@/types/entities";

export const formSchema = z.object({
  comment: z.string().min(1),
  parentId: z.number().optional(),
});

export type CreateCommentPayload = z.infer<typeof formSchema>;

const createComment = async ({
  workspaceId,
  boardId,
  itemId,
  data,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  data: CreateCommentPayload;
}) => {
  const response = await http.post<ItemComment>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/comments`,
    data
  );

  return response.data;
};

interface UseCreateCommentOptions {
  mutationConfig?: MutationConfig<typeof createComment>;
}

export const useCreateComment = ({
  mutationConfig,
}: UseCreateCommentOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createComment,
  });
};
