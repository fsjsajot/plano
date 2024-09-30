import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export const useBoardsData = ({ id }: { id: string }) => {
  const fetchWorkspace = async () => {
    const response = await http.get(`/api/workspaces/${id}/boards`);

    return response.data;
  };

  return useQuery({
    queryKey: ["workspace_boards", id],
    queryFn: fetchWorkspace,
    retry: false,
    throwOnError: true,
    staleTime: 60000
  });
};
