import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Board } from "@/types/entities";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export type CreateBoardPayload = z.infer<typeof formSchema>;

const createBoard = async ({
  workspaceId,
  data,
}: {
  workspaceId: number;
  data: CreateBoardPayload;
}) => {
  const response = await http.post<Board>(
    `/api/workspaces/${workspaceId}/boards`,
    data
  );

  return response.data;
};

interface UseCreateBoardOptions {
  mutationConfig?: MutationConfig<typeof createBoard>;
}

export const useCreateBoard = ({
  mutationConfig,
}: UseCreateBoardOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createBoard,
  });
};
