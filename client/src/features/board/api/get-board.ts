import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Board } from "@/types/entities";

export const getBoard = async (workspaceId: number, boardId: number) => {
  const response = await http.get<Board>(
    `/api/workspaces/${workspaceId}/boards/${boardId}`
  );

  return response.data;
};

export const getBoardOptions = (workspaceId?: number, boardId?: number) => {
  return queryOptions({
    queryKey: ["workspace_boards", workspaceId, boardId],
    queryFn: () => getBoard(workspaceId!, boardId!),
    staleTime: Infinity,
    enabled: !!workspaceId && !!boardId,
  });
};

type UseBoardOptions = {
  workspaceId?: number;
  boardId?: number;
  queryConfig?: QueryConfig<typeof getBoardOptions>;
};

export const useBoard = ({
  workspaceId,
  boardId,
  queryConfig,
}: UseBoardOptions) => {
  return useQuery({
    ...getBoardOptions(workspaceId, boardId),
    ...queryConfig,
  });
};
