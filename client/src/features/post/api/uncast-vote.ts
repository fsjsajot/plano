import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { ItemVote } from "@/types/entities";

const uncastVote = async ({
  workspaceId,
  boardId,
  itemId,
  voteId
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  voteId: number;
}) => {
  const response = await http.delete<ItemVote>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/votes/${voteId}`
  );

  return response.data;
};

interface UseUnCastVoteOptions {
  mutationConfig?: MutationConfig<typeof uncastVote>;
}

export const useUncastVote = ({ mutationConfig }: UseUnCastVoteOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: uncastVote,
  });
};
