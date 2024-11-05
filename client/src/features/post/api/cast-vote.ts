import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { ItemVote } from "@/types/entities";

const castVote = async ({
  workspaceId,
  boardId,
  itemId,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
}) => {
  const response = await http.post<ItemVote>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/votes`
  );

  return response.data;
};

export interface UseCastVoteOptions {
  mutationConfig?: MutationConfig<typeof castVote>;
}

export const useCastVote = ({ mutationConfig }: UseCastVoteOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: castVote,
  });
};
