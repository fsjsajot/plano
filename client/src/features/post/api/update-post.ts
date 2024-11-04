import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { BoardItem } from "@/types/entities";
import { z } from "zod";
import { uploadAttachments } from "@/features/board/api/upload-attachments";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  statusId: z.coerce.number().optional(),
  files: z.instanceof(FileList).optional(),
});

export type UpdatePostPayload = z.infer<typeof formSchema>;

const updatePost = async ({
  workspaceId,
  boardId,
  itemId,
  data: { files, ...rest },
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  data: UpdatePostPayload;
}) => {
  const response = await http.patch<BoardItem>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}`,
    rest
  );

  if (files && files.length > 0) {
    uploadAttachments({
      workspaceId,
      boardId,
      itemId: response.data.id,
      files,
    });
  }

  return response.data;
};

interface UseUpdatePostOptions {
  mutationConfig?: MutationConfig<typeof updatePost>;
}

export const useUpdatePost = ({
  mutationConfig,
}: UseUpdatePostOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updatePost,
  });
};
