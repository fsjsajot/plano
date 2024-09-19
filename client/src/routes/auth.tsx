import AuthLayout from "@/features/auth/AuthLayout";
import ForgotPasswordPage from "@/features/auth/forgot-password/ForgotPasswordPage";
import LoginPage from "@/features/auth/login/LoginPage";
import PasswordResetPage from "@/features/auth/password-reset/PasswordResetPage";
import RegistrationPage from "@/features/auth/registration/RegistrationPage";
import VerifyEmailPage from "@/features/auth/verify-email/VerifyEmailPage";
import { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: "register",
      element: <RegistrationPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "verify-email",
      element: <VerifyEmailPage />,
    },
    {
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },

    {
      path: "password-reset/:token",
      element: <PasswordResetPage />,
    },
  ],
};
