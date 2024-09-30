import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { http } from "@/lib/http";
import { User } from "@/types/entities";
import { useNavigate } from "react-router-dom";

type CurrentUser = User & {redirect?: string}

export const useAuthUser = () => {
  const getCurrentUser = async () => {
    try {
      const response = await http.get<CurrentUser>("/api/user");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 409) {
          console.log(error);
          return null;
        }

        return {redirect: '/verify-email'};
      }
    }
  };

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => getCurrentUser(),
    staleTime: 120000,
  });
};
