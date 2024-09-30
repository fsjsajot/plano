import { useWorkspaces } from "@/hooks/workspaces/useWorkspaces";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Workspace } from "@/types/entities";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { LoadingSpinner } from "../ui/loading-spinner";

export const DeleteWorkspaceDialog = ({
  open,
  onOpenChange,
  workspace,
}: {
  workspace: Workspace;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteWorkspace } = useWorkspaces();
  const form = useForm();

  const onSubmit = async () => {
    await deleteWorkspace(workspace.id).then(() => onOpenChange());
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
