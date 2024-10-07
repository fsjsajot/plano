import { http } from "@/lib/http";
import { Workspace } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaceData = ({ id }: { id: string }) => {
  const fetchWorkspace = async () => {
    const response = await http.get<Workspace>(`/api/workspaces/${id}`);

    return response.data;
  };

  return useQuery({
    queryKey: ["workspace", Number(id)],
    queryFn: fetchWorkspace,
    retry: false,
    throwOnError: true,
    staleTime: 5000
  });
};
