import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";

const deleteWorkspace = async ({ workspaceId }: { workspaceId: number }) => {
  const response = await http.delete<Workspace>(
    `/api/workspaces/${workspaceId}`
  );

  return response.data;
};

interface UseDeleteWorkspaceOptions {
  mutationConfig?: MutationConfig<typeof deleteWorkspace>;
}

export const useDeleteWorkspace = ({
  mutationConfig,
}: UseDeleteWorkspaceOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: deleteWorkspace,
  });
};
