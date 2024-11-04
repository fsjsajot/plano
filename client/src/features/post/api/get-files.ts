import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { BoardItemFile } from "@/types/entities";

export const getFiles = async (
  workspaceId: number,
  boardId: number,
  itemId: number
) => {
  const response = await http.get<BoardItemFile[]>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/files`
  );

  return response.data;
};

export const getFileOptions = (
  workspaceId?: number,
  boardId?: number,
  itemId?: number
) => {
  return queryOptions({
    queryKey: ["item_files", itemId],
    queryFn: () => getFiles(workspaceId!, boardId!, itemId!),
    staleTime: Infinity,
    enabled: !!workspaceId && !!boardId && !!itemId,
  });
};

type UsePostAttachmentsOptions = {
  workspaceId?: number;
  boardId?: number;
  itemId?: number;
  queryConfig?: QueryConfig<typeof getFileOptions>;
};

export const usePostAttachments = ({
  workspaceId,
  boardId,
  itemId,
  queryConfig,
}: UsePostAttachmentsOptions) => {
  return useQuery({
    ...getFileOptions(workspaceId, boardId, itemId),
    ...queryConfig,
  });
};
