import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Workspace } from "@/types/entities";
import { useDeleteWorkspace } from "../api/delete-workspace";

const schema = (workspaceName: string) =>
  z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .refine((data) => data === workspaceName, {
        message: "Must match the workspace name.",
      }),
  });

type FormType = z.infer<ReturnType<typeof schema>>;

export const DeleteWorkspaceDialog = ({
  open,
  onOpenChange,
  workspace,
  redirect = false,
}: {
  workspace: Workspace;
  open: boolean;
  onOpenChange: () => void;
  redirect?: boolean;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<FormType>({
    resolver: zodResolver(schema(workspace.name)),
    values: {
      name: "",
    },
  });
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteWorkspace({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        });

        onOpenChange();

        if (redirect) {
          navigate("/workspaces");
        }
      },
    },
  });

  const onSubmit = async () => {
    mutate({ workspaceId: workspace.id });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the Workspace name to delete</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Button disabled={isPending} variant="destructive" type="submit">
                {isPending ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner />
                    Deleting...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
