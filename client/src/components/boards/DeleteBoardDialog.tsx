import { useForm } from "react-hook-form";

import { useBoards } from "@/hooks/boards/useBoards";
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

export const DeleteBoardDialog = ({
  open,
  onOpenChange,
  workspaceId,
  boardId,
}: {
  workspaceId: string;
  boardId: string;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteBoard } = useBoards();
  const form = useForm();

  const onSubmit = async () => {
    await deleteBoard(workspaceId, boardId).then(() => onOpenChange());
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your board.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                disabled={form.formState.isSubmitting}
                variant="destructive"
                type="submit"
              >
                {form.formState.isSubmitting ? (
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
