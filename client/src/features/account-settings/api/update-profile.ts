import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { User } from "@/types/entities";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(1)
});

export type UpdateUserProfilePayload = z.infer<typeof formSchema>;

const updateUserProfile = async (data: UpdateUserProfilePayload) => {
  const response = await http.patch<User>(`/api/user/profile`, data);

  return response.data;
};

interface UseUpdateUserProfileOptions {
  mutationConfig?: MutationConfig<typeof updateUserProfile>;
}

export const useUpdateUserProfile = ({
  mutationConfig,
}: UseUpdateUserProfileOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateUserProfile,
  });
};
