import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { User } from "@/types/entities";

export const formSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export type UpdateUserPasswordPayload = z.infer<typeof formSchema>;

const updateUserPassword = async (data: UpdateUserPasswordPayload) => {
  const response = await http.patch<User>(`/api/user/password`, data);

  return response.data;
};

interface UseUpdateUserPasswordOptions {
  mutationConfig?: MutationConfig<typeof updateUserPassword>;
}

export const useUpdateUserPassword = ({
  mutationConfig,
}: UseUpdateUserPasswordOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateUserPassword,
  });
};
