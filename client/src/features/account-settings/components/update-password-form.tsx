import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    UpdateUserPasswordPayload,
    formSchema,
    useUpdateUserPassword,
} from "../api/update-password";

export const UpdatePasswordForm = () => {
  const queryClient = useQueryClient();
  const { mutate: updatePassword, isPending } = useUpdateUserPassword({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Your password has been updated.");

        queryClient.invalidateQueries({
          queryKey: ["me"],
        });
      },

      onError: (error) => {
        console.error(error);

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data.message);
        }

        throw error;
      },
    },
  });
  const form = useForm<UpdateUserPasswordPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: UpdateUserPasswordPayload) => {
    updatePassword(values);
  };

  return (
    <Form key="update_password_form" {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isDirty && (
          <div className="space-y-4">
            <Alert
              variant="unstyled"
              className="border-blue-500 bg-blue-100 flex items-center"
            >
              <Info className="mr-1 text-2xl relative" />
              <AlertDescription className="p-0">
                Changing your password will log you out to this app.
              </AlertDescription>
            </Alert>

            <Button disabled={isPending} type="submit">
              {isPending ? (
                <span className="inline-flex items-center gap-1">
                  <LoadingSpinner />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
