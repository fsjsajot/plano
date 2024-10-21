import { RouteObject } from "react-router-dom";

import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordPage } from "@/features/auth/forgot-password/forgot-password";
import { LoginPage } from "@/features/auth/login/login";
import { PasswordResetPage } from "@/features/auth/password-reset/password-reset";
import { RegistrationPage } from "@/features/auth/registration/registration";
import { VerifyEmailPage } from "@/features/auth/verify-email/verify-email";

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
