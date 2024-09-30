import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useBoards } from "@/hooks/boards/useBoards";
import { Board } from "@/types/entities";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const EditBoardDialog = ({
  workspaceId,
  board,
  open,
  onOpenChange,
}: {
  workspaceId: string;
  board: Board;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { updateBoard } = useBoards();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: board.name,
      description: board.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateBoard(workspaceId, board.id, values).then(() => {
        form.reset();
        onOpenChange();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit your board record below</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
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
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                className="w-full"
                type="submit"
              >
                {form.formState.isSubmitting ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner />
                    Updating...
                  </span>
                ) : (
                  "Update board"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
