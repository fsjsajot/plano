import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Status } from "@/types/entities";

export const getStatuses = async (workspaceId: number) => {
  const response = await http.get<Status[]>(
    `/api/workspaces/${workspaceId}/statuses`
  );

  return response.data;
};

export const getStatusesOptions = (workspaceId?: number) => {
  return queryOptions({
    queryKey: ["workspace_statuses", workspaceId],
    queryFn: () => getStatuses(workspaceId!),
    staleTime: Infinity,
    enabled: !!workspaceId
  });
};

type UseStatusesOptions = {
  workspaceId?: number;
  queryConfig?: QueryConfig<typeof getStatusesOptions>;
};

export const useStatuses = ({
  workspaceId,
  queryConfig,
}: UseStatusesOptions) => {
  return useQuery({
    ...getStatusesOptions(workspaceId),
    ...queryConfig,
  });
};
