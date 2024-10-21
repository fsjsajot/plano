import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Board } from "@/types/entities";

export const getBoards = async (workspaceId: number) => {
  const response = await http.get<Board[]>(
    `/api/workspaces/${workspaceId}/boards`
  );

  return response.data;
};

export const getBoardsOptions = (workspaceId: number) => {
  return queryOptions({
    queryKey: ["workspace_boards", workspaceId],
    queryFn: () => getBoards(workspaceId),
    staleTime: Infinity,
  });
};

type UseBoardsOptions = {
  workspaceId: number;
  queryConfig?: QueryConfig<typeof getBoardsOptions>;
};

export const useBoards = ({ workspaceId, queryConfig }: UseBoardsOptions) => {
  return useQuery({
    ...getBoardsOptions(workspaceId),
    ...queryConfig,
  });
};
