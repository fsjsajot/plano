import { useMutation } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { MutationConfig } from "@/lib/react-query";
import { User } from "@/types/entities";

const updateUserAvatar = async (data: FormData) => {
  const response = await http.post<User>(`/api/user/profile/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

interface UseUpdateUserAvatarOptions {
  mutationConfig?: MutationConfig<typeof updateUserAvatar>;
}

export const useUpdateUserAvatar = ({
  mutationConfig,
}: UseUpdateUserAvatarOptions = {}) => {
  const { onSuccess: successCallback, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => successCallback?.(...args),
    ...restConfig,
    mutationFn: updateUserAvatar,
  });
};
