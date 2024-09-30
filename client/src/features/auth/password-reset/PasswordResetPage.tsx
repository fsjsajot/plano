import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Navigate, useParams, useSearchParams } from "react-router-dom";

const formSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine(
    (values) => {
      return values.password === values.passwordConfirmation;
    },
    {
      message: "Passwords must match!",
      path: ["passwordConfirmation"],
    }
  );

export default function PasswordResetPage() {
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const [searchParams] = useSearchParams();

  const [count, setCount] = useState(5);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async ({
    password,
    passwordConfirmation,
  }: z.infer<typeof formSchema>) => {
    const data = await resetPassword({
      password,
      token,
      email,
      password_confirmation: passwordConfirmation,
    });
    setStatus(data.status);
  };

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams.get("email")]);

  useEffect(() => {
    if (count === 0 || !status) return;
    const interval = setInterval(() => setCount(count - 1), 1000);

    return () => clearInterval(interval);
  }, [count, status]);

  if (count === 0) {
    return <Navigate to="/login" replace />;
  }
  console.log(`Current count: ${count}`);

  return (
    <div className="flex items-center justify-center w-96 mx-auto flex-col">
      <div className="text-left w-full mb-4">
        <h3 className={"font-semibold leading-normal tracking-tight"}>
          Set your new password
        </h3>
      </div>

      {status && (
        <Alert className="border-green-400 my-4 bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 dark:border-green-600">
          <AlertDescription>
            {status} {"You will be redirected to the login page in "}
            <span className="font-medium">{count}</span>
            {count > 1 ? " seconds." : " second."}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormItem>
            <FormLabel className="font-medium">Email</FormLabel>
            <p id="email">{email}</p>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
