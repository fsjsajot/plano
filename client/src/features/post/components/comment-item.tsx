import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ItemComment } from "@/types/entities";
import { ArrowBendUpLeft, Pencil, Trash } from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { CommentEditor } from "./comment-editor";
import {
  CreateCommentPayload,
  formSchema,
  useCreateComment,
} from "../api/create-comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, dateFormatter, timeAgo } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EditComment } from "./edit-comment";
import { DeleteCommentDialog } from "./delete-comment-dialog";

interface CommentItemProps {
  workspaceId: number;
  boardId: number;
  itemId: number;
  itemComment: ItemComment;
  userId: number;
}

export const CommentItem = ({
  itemComment,
  workspaceId,
  boardId,
  itemId,
  userId,
}: CommentItemProps) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showEditComment, setShowEditComment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        setShowReplyEditor(false);
      },
    },
  });

  const comment = form.watch("comment");

  const onSubmit = (values: CreateCommentPayload) => {
    mutate({
      workspaceId,
      boardId,
      itemId,
      data: {
        ...values,
        parentId: itemComment.id ?? itemComment.parentId,
      },
    });
  };

  return (
    <Fragment>
      {showEditComment && (
        <EditComment
          workspaceId={workspaceId}
          boardId={boardId}
          itemId={itemId}
          onClose={() => setShowEditComment(false)}
          itemComment={itemComment}
        />
      )}

      {!showEditComment && (
        <div
          className={cn("border-2 p-4", {
            "mt-4 mb-2": itemComment.depth === 0,
            "ml-6": itemComment.depth === 1,
            "ml-12 mt-2 mb-2": itemComment.depth === 2,
          })}
        >
          <div className="flex">
            <div className="space-x-2">
              <span className="font-semibold">
                By {itemComment.author.name}
              </span>
              <span title={dateFormatter.format(new Date(itemComment.createdAt))}>{timeAgo(itemComment.createdAt)}</span>
            </div>

            <div className="flex flex-1 justify-end gap-2">
              {itemComment.author.id === userId && (
                <Fragment>
                  <Button
                    onClick={() => setShowEditComment(true)}
                    variant="ghost"
                    size="sm"
                  >
                    <Pencil className="mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="mr-2" />
                    Delete
                  </Button>
                </Fragment>
              )}

              {itemComment.depth < 2 && (
                <Button
                  onClick={() => setShowReplyEditor(!showReplyEditor)}
                  variant="ghost"
                  size="sm"
                >
                  <ArrowBendUpLeft className="mr-2" /> Reply
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Markdown>{itemComment.comment}</Markdown>
          </div>
        </div>
      )}

      {showReplyEditor && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full mb-4"
          >
            <Controller
              render={({ field: { onChange } }) => (
                <CommentEditor onChange={onChange} />
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
      )}

      {showDeleteDialog && (
        <DeleteCommentDialog
          workspaceId={workspaceId}
          boardId={boardId}
          itemId={itemId}
          open={showDeleteDialog}
          onOpenChange={() => setShowDeleteDialog(false)}
          commentId={itemComment.id}
        />
      )}
    </Fragment>
  );
};
