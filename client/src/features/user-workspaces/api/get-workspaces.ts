import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getWorkspaces = async (includeAll: boolean) => {
  const workspaces = await http.get<Workspace[]>(
    `/api/workspaces${includeAll ? "?include=all" : ""}`
  );

  return workspaces.data;
};

export const getWorkspacesOptions = (includeAll: boolean) => {
  return queryOptions({
    queryKey: ["workspaces", includeAll],
    queryFn: () => getWorkspaces(includeAll),
    staleTime: Infinity,
  });
};

type UseWorkspacesOptions = {
  includeAll?: boolean;
  queryConfig?: QueryConfig<typeof getWorkspacesOptions>;
};

export const useWorkspaces = ({
  queryConfig,
  includeAll = false,
}: UseWorkspacesOptions = {}) => {
  return useQuery({
    ...getWorkspacesOptions(includeAll),
    ...queryConfig,
  });
};
