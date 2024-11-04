import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { BoardItem } from "@/types/entities";
import { uploadAttachments } from "./upload-attachments";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  statusId: z.coerce.number().optional(),
  files: z.instanceof(FileList).optional(),
});

export type CreatePostPayload = z.infer<typeof formSchema>;

const createPost = async ({
  workspaceId,
  boardId,
  data: { files, ...rest },
}: {
  workspaceId: number;
  boardId: number;
  data: CreatePostPayload;
}) => {
  
  const response = await http.post<BoardItem>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items`,
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

interface UseCreatePostOptions {
  mutationConfig?: MutationConfig<typeof createPost>;
}

export const useCreatePost = ({
  mutationConfig,
}: UseCreatePostOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createPost,
  });
};
