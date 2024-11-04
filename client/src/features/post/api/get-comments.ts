import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { ItemComment } from "@/types/entities";

export const getComments = async (
  workspaceId: number,
  boardId: number,
  itemId: number
) => {
  const response = await http.get<ItemComment[]>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/comments`
  );

  return response.data;
};

export const getCommentsOptions = (
  workspaceId?: number,
  boardId?: number,
  itemId?: number
) => {
  return queryOptions({
    queryKey: ["item_comments", itemId],
    queryFn: () => getComments(workspaceId!, boardId!, itemId!),
    staleTime: Infinity,
    enabled: !!workspaceId && !!boardId && !!itemId,
  });
};

type UsePostCommentsOptions = {
  workspaceId?: number;
  boardId?: number;
  itemId?: number;
  queryConfig?: QueryConfig<typeof getCommentsOptions>;
};

export const usePostComments = ({
  workspaceId,
  boardId,
  itemId,
  queryConfig,
}: UsePostCommentsOptions) => {
  return useQuery({
    ...getCommentsOptions(workspaceId, boardId, itemId),
    ...queryConfig,
  });
};
