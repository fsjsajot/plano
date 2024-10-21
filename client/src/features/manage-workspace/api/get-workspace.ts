import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getWorkspace = async (workspaceId: number) => {
  const response = await http.get<Workspace>(`/api/workspaces/${workspaceId}`);

  return response.data;
};

export const getWorkspaceOptions = (workspaceId: number) => {
  return queryOptions({
    queryKey: ["workspaces", workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    staleTime: Infinity,
  });
};

type UseWorkspacesOptions = {
  workspaceId: number;
  queryConfig?: QueryConfig<typeof getWorkspaceOptions>;
};

export const useWorkspace = ({
  workspaceId,
  queryConfig,
}: UseWorkspacesOptions) => {
  return useQuery({
    ...getWorkspaceOptions(workspaceId),
    ...queryConfig,
  });
};
