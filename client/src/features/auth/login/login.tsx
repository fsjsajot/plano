import { Link, useSearchParams } from "react-router-dom";
import { LoginForm } from "./login-form";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  return (
    <div className="flex items-center justify-center w-96 mx-auto flex-col">
      <div className="text-left w-full mb-4">
        <h3 className={"font-semibold leading-normal tracking-tight"}>
          Login to your account
        </h3>
        <p className="text-sm text-muted-foreground">
          Start managing your workspaces
        </p>
      </div>

      <LoginForm />

      <div className="text-center my-6 text-sm w-full">
        <span>New to Plano?</span>

        <Link
          to={redirectTo ? `/register?redirect_to=${redirectTo}` : "/register"}
          className="ml-1 text-blue-600 font-medium hover:text-blue-700"
        >
          Create account
        </Link>
      </div>
    </div>
  );
};
