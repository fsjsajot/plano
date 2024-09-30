import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/auth/useAuth";

const formSchema = z.object({
  email: z.string().min(1).email(),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [status, setStatus] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await forgotPassword(values);
    setStatus(data.status);
  };

  return (
    <div className="flex items-center justify-center w-96 mx-auto flex-col">
      <div className="text-left w-full mb-4">
        <h3 className={"font-semibold leading-normal tracking-tight"}>
          Reset your password
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your user account's verified email address and we will send you
          a password reset link.
        </p>
      </div>

      {status && (
        <Alert className="border-green-400 my-4 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 dark:border-green-600">
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-1">
                  <LoadingSpinner />
                  Sending...
                </span>
              ) : (
                "Send password reset email"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
