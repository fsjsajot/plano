import { Link, useSearchParams } from "react-router-dom";

import RegistrationForm from "./RegistrationForm";

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  return (
    <div className="flex items-center justify-center w-96 mx-auto flex-col">
      <div className="text-left w-full mb-4">
        <h3 className={"font-semibold leading-normal tracking-tight"}>
          Create your account today
        </h3>
        <p className="text-sm text-muted-foreground">
          Start collaborating with others
        </p>
      </div>

      <RegistrationForm />

      <div className="text-center my-6 text-sm w-full">
        <span>Have a Plano account?</span>

        <Link
          to={redirectTo ? `/login?redirect_to=${redirectTo}` : "/login"}
          className="ml-1 text-blue-600 font-medium hover:text-blue-700"
        >
          Click here
        </Link>
      </div>
    </div>
  );
}
