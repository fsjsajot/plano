import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getWorkspaces = async () => {
  const workspaces = await http.get<Workspace[]>("/api/workspaces");

  return workspaces.data;
};

export const getWorkspacesOptions = () => {
  return queryOptions({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
    staleTime: Infinity,
  });
};

type UseWorkspacesOptions = {
  queryConfig?: QueryConfig<typeof getWorkspacesOptions>;
};

export const useWorkspaces = ({ queryConfig }: UseWorkspacesOptions = {}) => {
  return useQuery({
    ...getWorkspacesOptions(),
    ...queryConfig,
  });
};
