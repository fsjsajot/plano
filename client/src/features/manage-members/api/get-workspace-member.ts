import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { User } from "@/types/entities";

export const getWorkspaceMember = async (
  workspaceId: string,
  memberId: string
) => {
  const response = await http.get<User>(
    `/api/workspaces/${workspaceId}/members/${memberId}`
  );

  return response.data;
};

export const getWorkspaceMemberOptions = (
  workspaceId: string,
  memberId: string
) => {
  return queryOptions({
    queryKey: ["workspace_member", workspaceId, memberId],
    queryFn: () => getWorkspaceMember(workspaceId, memberId),
  });
};

type UseWorkspaceMemberOptions = {
  workspaceId: string;
  memberId: string;
  queryConfig?: QueryConfig<typeof getWorkspaceMemberOptions>;
};

export const useWorkspaceMember = (props: UseWorkspaceMemberOptions) => {
  const { workspaceId, memberId, queryConfig = {} } = props;
  return useQuery({
    ...getWorkspaceMemberOptions(workspaceId, memberId),
    ...queryConfig,
  });
};
