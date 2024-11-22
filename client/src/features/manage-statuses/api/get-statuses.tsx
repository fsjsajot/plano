import { queryOptions, useQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { Status } from "@/types/entities";

export const getStatuses = async (
  workspaceId: number,
  visibleOnly?: boolean,
  loadItems?: boolean
) => {
  const params = new URLSearchParams();

  if (visibleOnly) {
    params.append('visible', 'true')
  }

  if (loadItems) {
    params.append('load_items', 'true')
  }

  const query = params.size > 0 ? `?${params.toString()}` : "";

  const response = await http.get<Status[]>(
    `/api/workspaces/${workspaceId}/statuses${query}`
  );

  return response.data;
};

export const getStatusesOptions = (
  workspaceId?: number,
  visibleOnly?: boolean,
  loadItems?: boolean
) => {
  return queryOptions({
    queryKey: ["workspace_statuses", workspaceId, visibleOnly, loadItems],
    queryFn: () => getStatuses(workspaceId!, visibleOnly, loadItems),
    staleTime: 0,
    enabled: !!workspaceId,
  });
};

type UseStatusesOptions = {
  workspaceId?: number;
  visibleOnly?: boolean;
  loadItems?: boolean;
  queryConfig?: QueryConfig<typeof getStatusesOptions>;
};

export const useStatuses = ({
  workspaceId,
  queryConfig,
  visibleOnly = false,
  loadItems = false,
}: UseStatusesOptions) => {
  return useQuery({
    ...getStatusesOptions(workspaceId, visibleOnly, loadItems),
    ...queryConfig,
  });
};
