import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { http } from "@/lib/http";
import { User } from "@/types/entities";
import { useNavigate } from "react-router-dom";

export const useAuthUser = (
  {
    shouldRedirect,
  }: {
    shouldRedirect: boolean;
  } = { shouldRedirect: true }
) => {
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      const response = await http.get<User>("/api/user");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 409) {
          console.log(error);

          if (shouldRedirect) {
            navigate("/login", { replace: true });
          }

          return null;
        }

        navigate("/verify-email", {
          replace: true,
        });

        return null;
      }

      throw error;
    }
  };

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => getCurrentUser(),
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });
};
