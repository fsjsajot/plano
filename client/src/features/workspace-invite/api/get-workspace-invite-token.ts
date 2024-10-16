import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { WorkspaceInvite } from "@/types/entities";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getWorkspaceInviteByToken = async (
  workspaceId: string,
  token: string
) => {
  const response = await http.get<WorkspaceInvite>(
    `/api/workspaces/${workspaceId}/invites/${token}`
  );

  return response.data;
};

export const getWorkspaceInviteByTokenOptions = ({
  workspaceId,
  token,
}: {
  workspaceId: string;
  token: string;
}) => {
  return queryOptions({
    queryKey: ["workspace_invite", token],
    queryFn: () => getWorkspaceInviteByToken(workspaceId, token),
    staleTime: Infinity,
    retry: false,
  });
};

type UseWorkspaceTokenInviteOptions = {
  workspaceId: string;
  token: string;
  queryConfig?: QueryConfig<typeof getWorkspaceInviteByTokenOptions>;
};

export const useWorkspaceTokenInvite = ({
  workspaceId,
  token,
  queryConfig,
}: UseWorkspaceTokenInviteOptions) => {
  return useQuery({
    ...getWorkspaceInviteByTokenOptions({ workspaceId, token }),
    ...queryConfig,
  });
};
