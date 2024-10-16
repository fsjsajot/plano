import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getWorkspaceInvitedEmail = async (
  workspaceId: string,
  token: string,
  email: string
) => {
  return http.get(
    `/api/workspaces/${workspaceId}/invited/${token}?email=${encodeURIComponent(
      email || ""
    )}`
  );
};

export const getWorkspaceInvitedEmailOptions = ({
  workspaceId,
  token,
  email,
}: {
  workspaceId: string;
  token: string;
  email: string;
}) => {
  return queryOptions({
    queryKey: ["workspace_invited", token],
    queryFn: () => getWorkspaceInvitedEmail(workspaceId, token, email),
    staleTime: Infinity,
    retry: false,
  });
};

type UseWorkspaceInvitedEmailOptions = {
  workspaceId: string;
  token: string;
  email: string;
  queryConfig?: QueryConfig<typeof getWorkspaceInvitedEmailOptions>;
};

export const useWorkspaceInvitedEmail = ({
  workspaceId,
  email,
  token,
  queryConfig,
}: UseWorkspaceInvitedEmailOptions) => {
  return useQuery({
    ...getWorkspaceInvitedEmailOptions({ workspaceId, token, email }),
    ...queryConfig,
  });
};
