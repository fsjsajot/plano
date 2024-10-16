import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotch } from "@phosphor-icons/react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth/useAuth";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name field is required." })
    .max(255, { message: "Name field must contain at most 255 character(s)" }),
  email: z.string().min(1, { message: "Email field is required." }).email(),
  password: z.string().min(1, { message: "Password field is required." }),
});

export default function RegistrationForm() {
  const { register } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) =>
    await register(values).then(() => {
      if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
        });
      }
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
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
                <CircleNotch className="animate-spin" />
                Creating...
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
