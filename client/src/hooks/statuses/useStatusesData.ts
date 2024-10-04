import { http } from "@/lib/http";
import { Status } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";

export const useStatusesData = ({ id }: { id: string }) => {
  const fetchWorkspaceStatuses = async () => {
    const response = await http.get<Status[]>(`/api/workspaces/${id}/statuses`);

    return response.data;
  };

  return useQuery({
    queryKey: ["workspace_statuses"],
    queryFn: fetchWorkspaceStatuses,
    retry: false,
    throwOnError: true,
    staleTime: 60000,
  });
};
