import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const VerifyEmailPage = () => {
  const { resendEmailVerification } = useAuth();
  const [status, setStatus] = useState("");

  const form = useForm();

  const onSubmit = async () => {
    const data = await resendEmailVerification();
    setStatus(data.status);
  };

  return (
    <div className="w-[450px] mx-auto mt-14">
      {status === "verification-link-sent" && (
        <Alert className="border-green-400 my-4 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 dark:border-green-600">
          <AlertDescription>
            A new verification link has been sent to the email address you
            provided during registration.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-4 text-sm text-foreground">
        Thanks for signing up! Before getting started, could you verify your
        email address by clicking on the link we just emailed to you? If you
        didn't receive the email, we will gladly send you another.
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner />
                    Resending...
                  </span>
                ) : (
                  "Resend verification email"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
