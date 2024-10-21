import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

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
import { useDeleteBoard } from "../api/delete-board";
import { Form } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteBoardDialog = ({
  open,
  onOpenChange,
  workspaceId,
  boardId,
}: {
  workspaceId: string;
  boardId: number;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteBoard({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_boards", Number(workspaceId)],
        });
        onOpenChange();
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

  const form = useForm();

  const onSubmit = async () =>
    mutate({ workspaceId: Number(workspaceId), boardId: Number(boardId) });

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
