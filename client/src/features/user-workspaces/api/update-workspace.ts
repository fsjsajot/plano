import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type UpdateWorkspacePayload = z.infer<typeof formSchema>;

const updateWorkspace = async ({
  workspaceId,
  data,
}: {
  workspaceId: number;
  data: UpdateWorkspacePayload;
}) => {
  const response = await http.patch<Workspace>(
    `/api/workspaces/${workspaceId}`,
    data
  );

  return response.data;
};

interface UseUpdateWorkspaceOptions {
  mutationConfig?: MutationConfig<typeof updateWorkspace>;
}

export const useUpdateWorkspace = ({
  mutationConfig,
}: UseUpdateWorkspaceOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateWorkspace,
  });
};
