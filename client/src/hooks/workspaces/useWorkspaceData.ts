import { http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaceData = ({ id }: { id: string }) => {
  const fetchWorkspace = async () => {
    const response = await http.get(`/api/workspaces/${id}`);

    return response.data;
  };

  return useQuery({
    queryKey: ["workspace", id],
    queryFn: fetchWorkspace,
    retry: false,
    throwOnError: true,
    staleTime: 5000
  });
};
