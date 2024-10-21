import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Workspace } from "@/types/entities";

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateWorkspacePayload = z.infer<typeof formSchema>;

const createWorkspace = async ({ data }: { data: CreateWorkspacePayload }) => {
  const response = await http.post<Workspace>(`/api/workspaces/`, data);

  return response.data;
};

interface UseCreateWorkspaceOptions {
  mutationConfig?: MutationConfig<typeof createWorkspace>;
}

export const useCreateWorkspace = ({
  mutationConfig,
}: UseCreateWorkspaceOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createWorkspace,
  });
};
