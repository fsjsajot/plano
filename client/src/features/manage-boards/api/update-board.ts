import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types/entities";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type UpdateBoardPayload = z.infer<typeof formSchema>;

const updateBoard = async ({
  workspaceId,
  boardId,
  data,
}: {
  workspaceId: number;
  boardId: number;
  data: UpdateBoardPayload;
}) => {
  const response = await http.patch<Board>(
    `/api/workspaces/${workspaceId}/boards/${boardId}`,
    data
  );

  return response.data;
};

interface UseUpdateBoardOptions {
  mutationConfig?: MutationConfig<typeof updateBoard>;
}

export const useUpdateBoard = ({
  mutationConfig,
}: UseUpdateBoardOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateBoard,
  });
};
