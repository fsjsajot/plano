import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { Status } from "@/types/entities";

export const formSchema = z.object({
  name: z.string().min(1),
  visibility: z.boolean().default(true),
});

export type CreateStatusPayload = z.infer<typeof formSchema>;

const createStatus = async ({
  workspaceId,
  data,
}: {
  workspaceId: number;
  data: CreateStatusPayload;
}) => {
  const response = await http.post<Status>(
    `/api/workspaces/${workspaceId}/statuses`,
    data
  );

  return response.data;
};

interface UseCreateStatusOptions {
  mutationConfig?: MutationConfig<typeof createStatus>;
}

export const useCreateStatus = ({
  mutationConfig,
}: UseCreateStatusOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: createStatus,
  });
};
