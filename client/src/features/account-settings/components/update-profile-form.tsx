import { useForm } from "react-hook-form";
import {
  UpdateUserProfilePayload,
  formSchema,
  useUpdateUserProfile,
} from "../api/update-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/entities";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import axios from "axios";

export const UpdateProfileForm = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const { mutate: updateUserProfile, isPending } = useUpdateUserProfile({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Your profile has been updated.");

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

  const form = useForm<UpdateUserProfilePayload>({
    resolver: zodResolver(formSchema),
    values: {
      name: user.name,
      email: user.email,
      password: "",
    },
  });

  const onSubmit = (values: UpdateUserProfilePayload) => {
    updateUserProfile(values);
  };

  return (
    <Form key="update_profile_form" {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
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
                <Input type="email" {...field} />
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
              <FormLabel className="font-medium">Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.isDirty && (
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
        )}
      </form>
    </Form>
  );
};
