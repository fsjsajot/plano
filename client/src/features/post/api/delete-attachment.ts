import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { BoardItemFile } from "@/types/entities";

const deleteAttachment = async ({
  workspaceId,
  boardId,
  itemId,
  fileId,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  fileId: number;
}) => {
  const response = await http.delete<BoardItemFile>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/files/${fileId}`
  );

  return response.data;
};

interface UseDeleteAttachmentOptions {
  mutationConfig?: MutationConfig<typeof deleteAttachment>;
}

export const useDeleteAttachment = ({
  mutationConfig,
}: UseDeleteAttachmentOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: deleteAttachment,
  });
};
