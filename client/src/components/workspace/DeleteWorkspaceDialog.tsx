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
import { useNavigate } from "react-router-dom";

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
  const { deleteWorkspace } = useWorkspaces();
  const form = useForm();
  const navigate = useNavigate();

  const onSubmit = async () => {
    await deleteWorkspace(workspace.id).then(() => {
      onOpenChange();

      if (redirect) {
        navigate("/workspaces");
      }
    });
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
