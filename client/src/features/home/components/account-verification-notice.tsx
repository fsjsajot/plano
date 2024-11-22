import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getVerificationDue } from "@/lib/utils";
import { User } from "@/types/entities";

export const AccountVerificationNotice = ({ user }: { user: User }) => {
  const { resendEmailVerification } = useAuth();
  const form = useForm();

  const verificationDue = getVerificationDue(user.createdAt);

  const onSubmit = async () => {
    try {
      await resendEmailVerification();
      toast.success("Successfully send a new email verification.");
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          (error.response?.data?.data && error.response?.data.data) ||
            "Unknown error occured"
        );
      }

      toast.error("Unknown error occured");
    }
  };

  return (
    <div className="-mx-4 bg-yellow-500 py-2 px-4 border flex items-center gap-4">
      <div className="space-x-2">
        <span>
          Please confirm your email address (
          <span className="font-bold">{user.email}</span>) in the next{" "}
          {verificationDue > 1
            ? `${verificationDue} days`
            : `${verificationDue} day`}
          .
        </span>

        <span>
          Unconfirmed accounts will be disabled when the limit reached.
        </span>
      </div>

      <div className="flex-1 justify-end">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button
              disabled={form.formState.isSubmitting}
              variant="secondary"
              className="font-semibold"
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-1">
                  <LoadingSpinner />
                  Resending...
                </span>
              ) : (
                "Resend Verification"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
