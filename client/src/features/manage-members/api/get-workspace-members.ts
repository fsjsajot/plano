import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { User } from "@/types/entities";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getWorkspaceMembers = async (workspaceId: string) => {
  const response = await http.get<User[]>(
    `/api/workspaces/${workspaceId}/members`
  );

  return response.data;
};

export const getWorkspaceMember = async (
  workspaceId: string,
  memberId: string
) => {
  const response = await http.get<User>(
    `/api/workspaces/${workspaceId}/members/${memberId}`
  );

  return response.data;
};

export const getWorkspaceMembersOptions = (workspaceId: string) => {
  return queryOptions({
    queryKey: ["workspace_members"],
    queryFn: () => getWorkspaceMembers(workspaceId),
  });
};

type UseWorkspaceMembersOptions = {
  workspaceId: string;
  queryConfig?: QueryConfig<typeof getWorkspaceMembersOptions>;
};

export const useWorkspaceMembers = ({
  workspaceId,
  queryConfig,
}: UseWorkspaceMembersOptions) => {
  return useQuery({
    ...getWorkspaceMembersOptions(workspaceId),
    ...queryConfig,
  });
};
