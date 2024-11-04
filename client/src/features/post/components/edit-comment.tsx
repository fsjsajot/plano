import { Form } from "@/components/ui/form";
import { ItemComment } from "@/types/entities";
import { Controller, useForm } from "react-hook-form";
import { CommentEditor } from "./comment-editor";
import {
  UpdateCommentPayload,
  formSchema,
  useUpdateComment,
} from "../api/update-comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQueryClient } from "@tanstack/react-query";

interface EditCommentProps {
  workspaceId: number;
  boardId: number;
  itemId: number;
  itemComment: ItemComment;
  onClose: () => void;
}

export const EditComment = ({
  itemComment,
  onClose,
  boardId,
  itemId,
  workspaceId,
}: EditCommentProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateComment({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["item_comments", itemId],
        });

        onClose();
      },
    },
  });
  const form = useForm<UpdateCommentPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: itemComment.comment,
      parentId: itemComment?.parentId || undefined,
    },
  });

  const onSubmit = (data: UpdateCommentPayload) =>
    mutate({
      workspaceId,
      boardId,
      itemId,
      commentId: itemComment.id,
      data,
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 w-full mb-4"
      >
        <Controller
          render={({ field: { onChange } }) => (
            <CommentEditor
              commentText={itemComment.comment}
              onChange={onChange}
            />
          )}
          name="comment"
          control={form.control}
        />

        <div className="flex gap-2">
          <Button disabled={isPending} size="sm" variant="secondary">
            {isPending ? (
              <span className="inline-flex items-center gap-1">
                <LoadingSpinner />
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </Button>

          <Button onClick={onClose} type="button" size="sm" variant="ghost">
            Discard Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
