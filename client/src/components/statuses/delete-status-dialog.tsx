import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useDeleteStatusMutation } from "@/hooks/statuses/useDeleteStatusMutation";

export const DeleteStatusDialog = ({
  open,
  onOpenChange,
  workspaceId,
  statusId,
}: {
  workspaceId: string;
  statusId: string;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { mutate, isPending } = useDeleteStatusMutation({
    onSuccessFn: () => {
      onOpenChange();
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
