import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { Textarea } from "@/components/ui/textarea";
import { HomeLayout } from "@/components/layout/home-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStatuses } from "@/features/manage-statuses/api/get-statuses";
import { usePost } from "../api/get-post";
import {
  UpdatePostPayload,
  formSchema,
  useUpdatePost,
} from "../api/update-post";
import { EditAttachmentsDropzone } from "./edit-attachments-upload-zone";
import { usePostAttachments } from "../api/get-files";
import { useDeleteAttachment } from "../api/delete-attachment";

export const EditPost = () => {
  const { workspaceId = "", boardId = "", itemId = "" } = useParams();
  const queryClient = useQueryClient();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses({
    workspaceId: Number(workspaceId),
  });

  const { data: post, isLoading: isPostLoading } = usePost({
    workspaceId: Number(workspaceId),
    boardId: Number(boardId),
    itemId: Number(itemId),
    queryConfig: {
      throwOnError: true,
    },
  });

  const { data: files, isLoading: isFilesLoading } = usePostAttachments({
    workspaceId: Number(workspaceId),
    boardId: Number(boardId),
    itemId: Number(itemId),
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useUpdatePost({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["item", Number(itemId)],
        });

        queryClient.invalidateQueries({
          queryKey: ["item_files", Number(itemId)],
        });

        queryClient.invalidateQueries({
          queryKey: ["workspace_boards", workspaceId, boardId],
        });

        form.reset();

        toast.success("Successfully updated post.");

        navigate(`/app/${workspaceId}/boards/${boardId}/posts/${itemId}`);
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },
    },
  });

  const form = useForm<UpdatePostPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title ?? "",
      description: post?.description ?? "",
    },
    values: post,
  });

  const {
    mutate: deleteAttachment,
    isPending: isDeletingAttachment,
    variables,
  } = useDeleteAttachment({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["item_files", Number(itemId)],
        });
        toast.success("Successfully deleted file.");
      },
    },
  });

  if (isStatusesLoading || isPostLoading || isFilesLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  const onSubmit = (values: UpdatePostPayload) => {
    mutate({
      workspaceId: Number(workspaceId),
      boardId: Number(boardId),
      itemId: Number(itemId),
      data: values,
    });
  };

  return (
    <HomeLayout>
      <div className="flex flex-col w-full px-4 pb-10 max-w-3xl mx-auto">
        <div className="flex justify-between pt-8 pb-4 items-center">
          <h1 className="font-semibold text-2xl ">Edit post</h1>
          <Link
            className={buttonVariants({ variant: "ghost" })}
            to={`/app/${workspaceId}/boards/${boardId}`}
          >
            Back to board
          </Link>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {statuses && (
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <div className="flex gap-4">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          {!!field.value && (
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => field.onChange("")}
                              variant="secondary"
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={String(status.id)}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Controller
              render={({ field: { onChange } }) => (
                <EditAttachmentsDropzone
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  itemFiles={files || []}
                  handleItemFileDelete={(fileId) =>
                    deleteAttachment({
                      workspaceId: Number(workspaceId),
                      boardId: Number(boardId),
                      itemId: Number(itemId),
                      fileId,
                    })
                  }
                  isDeleting={isDeletingAttachment}
                  deletedFileId={variables?.fileId}
                />
              )}
              name="files"
              control={form.control}
            />

            <div className="flex justify-end">
              <Button disabled={isPending} className="w-full" type="submit">
                {isPending ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner />
                    Updating...
                  </span>
                ) : (
                  "Update Post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </HomeLayout>
  );
};
