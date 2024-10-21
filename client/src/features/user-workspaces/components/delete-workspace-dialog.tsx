import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Workspace } from "@/types/entities";
import { useDeleteWorkspace } from "../api/delete-workspace";
import { Form } from "@/components/ui/form";

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
  const form = useForm();
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
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
            </form>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
