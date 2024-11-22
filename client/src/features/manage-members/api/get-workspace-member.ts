import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { User } from "@/types/entities";

export const getWorkspaceMember = async (
  workspaceId: number,
  memberId: number
) => {
  const response = await http.get<User>(
    `/api/workspaces/${workspaceId}/members/${memberId}`
  );

  return response.data;
};

export const getWorkspaceMemberOptions = (
  workspaceId: number,
  memberId: number
) => {
  return queryOptions({
    queryKey: ["workspace_member", workspaceId, memberId],
    queryFn: () => getWorkspaceMember(workspaceId, memberId),
  });
};

type UseWorkspaceMemberOptions = {
  workspaceId: number;
  memberId: number;
  queryConfig?: QueryConfig<typeof getWorkspaceMemberOptions>;
};

export const useWorkspaceMember = (props: UseWorkspaceMemberOptions) => {
  const { workspaceId, memberId, queryConfig = {} } = props;
  return useQuery({
    ...getWorkspaceMemberOptions(workspaceId, memberId),
    ...queryConfig,
  });
};
