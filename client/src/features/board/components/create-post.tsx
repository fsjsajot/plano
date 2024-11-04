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

import {
  CreatePostPayload,
  formSchema,
  useCreatePost,
} from "../api/create-post";
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
import { AttachmentDropzone } from "./attachments-upload-zone";

export const CreatePost = () => {
  const { workspaceId = "", boardId = "" } = useParams();
  const queryClient = useQueryClient();
  const { data: statuses, isLoading: isStatusesLoading } = useStatuses({
    workspaceId: Number(workspaceId),
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useCreatePost({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_boards", Number(workspaceId), Number(boardId)],
        });

        form.reset();

        toast.success("Created a new post");

        navigate(`/app/${workspaceId}/boards/${boardId}`);
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },
    },
  });

  const form = useForm<CreatePostPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (values: CreatePostPayload) => {
    mutate({
      workspaceId: Number(workspaceId),
      boardId: Number(boardId),
      data: values,
    });
  };

  if (isStatusesLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <HomeLayout>
      <div className="flex flex-col w-full px-4 pb-10 max-w-3xl mx-auto">
        <div className="flex justify-between pt-8 pb-4 items-center">
          <h1 className="font-semibold text-2xl ">Create a new post</h1>
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
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
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
                <AttachmentDropzone
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
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
                    Creating...
                  </span>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </HomeLayout>
  );
};
