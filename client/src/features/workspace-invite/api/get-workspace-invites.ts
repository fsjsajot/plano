import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const fetchWorkspaceInvites = async (id: string) => {
  try {
    const response = await http.get(`/api/workspaces/${id}/invites`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getWorkspaceInvitesOptions = (workspaceId: string) => {
  return queryOptions({
    queryKey: ["workspace_invites"],
    queryFn: () => fetchWorkspaceInvites(workspaceId),
    staleTime: Infinity,
    retry: false,
  });
};

type UseWorkspaceInvitesOptions = {
  workspaceId: string;
  queryConfig?: QueryConfig<typeof getWorkspaceInvitesOptions>;
};

export const useWorkspaceInvites = ({
  workspaceId,
  queryConfig,
}: UseWorkspaceInvitesOptions) => {
  return useQuery({
    ...getWorkspaceInvitesOptions(workspaceId),
    ...queryConfig,
  });
};
