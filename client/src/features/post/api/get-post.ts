import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { BoardItem } from "@/types/entities";

export const getItem = async (
  workspaceId: number,
  boardId: number,
  itemId: number
) => {
  const response = await http.get<BoardItem>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}`
  );

  return response.data;
};

export const getItemOptions = (
  workspaceId?: number,
  boardId?: number,
  itemId?: number
) => {
  return queryOptions({
    queryKey: ["item", itemId],
    queryFn: () => getItem(workspaceId!, boardId!, itemId!),
    staleTime: Infinity,
    enabled: !!workspaceId && !!boardId && !!itemId,
  });
};

type UsePostOptions = {
  workspaceId?: number;
  boardId?: number;
  itemId?: number;
  queryConfig?: QueryConfig<typeof getItemOptions>;
};

export const usePost = ({
  workspaceId,
  boardId,
  itemId,
  queryConfig,
}: UsePostOptions) => {
  return useQuery({
    ...getItemOptions(workspaceId, boardId, itemId),
    ...queryConfig,
  });
};
