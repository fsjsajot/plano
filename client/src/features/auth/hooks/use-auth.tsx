import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { toast } from "sonner";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const csrf = () => http.get("/sanctum/csrf-cookie");

  const register = async <T,>(values: T) => {
    await csrf();

    try {
      await http.post("/register", values);
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) throw error;

        toast.error(error.response.data.message);
      }
    }
  };

  const login = async <T,>(values: T) => {
    await csrf();

    try {
      await http.post("/login", values);
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) throw error;

        toast.error(error.response.data.message);
      }
    }
  };

  const forgotPassword = async (email: { email: string }) => {
    await csrf();

    try {
      const response = await http.post("/forgot-password", email);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) throw error;

        toast.error(error.response.data.message);
      }
    }
  };

  const resetPassword = async <T,>(values: T) => {
    await csrf();

    try {
      const response = await http.post("/reset-password", values);
      return response.data;
      //     return router.push("/login?reset=" + window.btoa(response.data.status));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) throw error;

        toast.error(error.response.data.message);
      }
    }
  };

  const resendEmailVerification = async () => {
    try {
      const response = await http.post("/email/verification-notification");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status !== 422) throw error;

        console.log(error);
      }
    }
  };

  const logout = async () => {
    await http
      .post("/logout")
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: ["me"],
        })
      );
  };

  return {
    register,
    login,
    logout,
    forgotPassword,
    resendEmailVerification,
    resetPassword,
  };
};
