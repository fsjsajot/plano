import { useForm } from "react-hook-form";

import { useDeleteStatus } from "../api/delete-status";
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
import { Form } from "@/components/ui/form";

export const DeleteStatusDialog = ({
  open,
  onOpenChange,
  workspaceId,
  statusId,
}: {
  workspaceId: number;
  statusId: number;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { mutate, isPending } = useDeleteStatus({
    mutationConfig: {
      onSuccess: () => {
        onOpenChange();
      },
    },
  });
  const form = useForm();

  const onSubmit = async () => {
    mutate({ workspaceId, statusId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your status.
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
