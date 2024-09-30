import { http } from "@/lib/http";
import { Workspace } from "@/types/entities";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const fetchUserWorkspaces = async () => {
    const workspaces = await http.get<Workspace[]>("/api/workspaces");

    return workspaces.data;
  };

  const createWorkspace = async <T>(values: T) => {
    const response = await http.post("/api/workspaces", values);
    queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });

    return response.data;
  };

  const updateWorkspace = async <T>(id: string, values: T) => {
    const response = await http.patch(`/api/workspaces/${id}`, values);
    queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });

    return response.data;
  };

  const deleteWorkspace = async (id: string) => {
    const response = await http.delete(`/api/workspaces/${id}`);
    queryClient.invalidateQueries({
      queryKey: ["workspaces"],
    });

    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchUserWorkspaces,
  });

  return {
    workspaces: data ?? [],
    isLoading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
};
