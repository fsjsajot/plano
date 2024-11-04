import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  CreateCommentPayload,
  formSchema,
  useCreateComment,
} from "../api/create-comment";
import { CommentEditor } from "./comment-editor";
import { usePostComments } from "../api/get-comments";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CommentItem } from "./comment-item";
import { ItemComment } from "@/types/entities";
import { Fragment } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";

interface CommentSectionProps {
  workspaceId: number;
  boardId: number;
  itemId: number;
  userId: number;
}

export const CommentSection = ({
  workspaceId,
  boardId,
  itemId,
  userId,
}: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateCommentPayload>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useCreateComment({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["item_comments", itemId],
        });

        form.reset();
      },
    },
  });
  const { data: comments = [], isLoading } = usePostComments({
    workspaceId,
    boardId,
    itemId,
  });

  const onSubmit = (values: CreateCommentPayload) => {
    mutate({
      itemId,
      workspaceId,
      boardId,
      data: values,
    });
  };

  const comment = form.watch("comment");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const generateCommentTree = (comments: ItemComment[], userId: number) => {
    return comments.map((comment) => (
      <Fragment key={comment.id}>
        <CommentItem
          itemComment={comment}
          key={comment.id}
          boardId={boardId}
          itemId={itemId}
          workspaceId={workspaceId}
          userId={userId}
        />

        {comment.children &&
          comment.children.length > 0 &&
          generateCommentTree(comment.children, userId)}
      </Fragment>
    ));
  };

  return (
    <div className="flex flex-col pb-8">
      <div className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <Controller
              render={({ field: { onChange, value } }) => (
                <CommentEditor commentText={value} onChange={onChange} />
              )}
              name="comment"
              control={form.control}
            />

            {!!comment && (
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
            )}
          </form>
        </Form>
      </div>

      {comments.length > 0 && (
        <div className="mt-4">
          <h5 className="text-md font-bold">Comments</h5>

          <div className="flex flex-col gap-2 mt-4">
            {generateCommentTree(comments, userId)}
          </div>
        </div>
      )}
    </div>
  );
};
