import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { http } from "@/lib/http";

export const useAuthUser = () => {
  const getCurrentUser = async () => {
    try {
      const response = await http.get("/api/user");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 409) {
          console.log(error);
          return null;
        }

        return { redirect: "/verify-email" };
      }
    }
  };

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => getCurrentUser(),
  });
};
