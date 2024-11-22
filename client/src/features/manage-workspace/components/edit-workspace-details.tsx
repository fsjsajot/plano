import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { http } from "@/lib/http";
import { Workspace } from "@/types/entities";
import { useUpdateWorkspace } from "../../user-workspaces/api/update-workspace";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const EditWorkspaceDetails = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateWorkspace({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workspace", workspace.id],
        });

        toast.success("Successfully updated workspace detail.");
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({
      workspaceId: workspace.id,
      data: values,
    });
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("logo", file);

    toast.info("Uploading logo...");
    await http
      .post(`/api/workspaces/${workspace.id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", workspace.id],
        });
        toast.success("Updated workspace logo.");
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data.message);
        }

        console.error(error);
        throw error;
      });
  };

  return (
    <div className="w-full min-w-96">
      <h3 className="border-b pb-2 text-md leading-normal tracking-tight">
        Workspace Detail
      </h3>
      <div className="grid grid-cols-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg pt-2"
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
                </FormItem>
              )}
            />

            {form.formState.isDirty && (
              <div className="">
                <Button size="sm" disabled={isPending} type="submit">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1">
                      <LoadingSpinner />
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>

        <div className="place-self-center">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-bold">Workspace Logo</h1>
            <Avatar className="h-40 w-40 rounded-md">
              <AvatarImage src={workspace.logoUrl} alt="workspace logo" />
              <AvatarFallback className="text-6xl rounded-md">
                {workspace.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <input
              accept="image/*"
              ref={inputFileRef}
              type="file"
              name="logo"
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];

                if (file) {
                  await handleFileUpload(file);
                }
              }}
              id="logo"
              className="hidden"
            />
            <Button
              onClick={() => {
                if (inputFileRef.current) {
                  inputFileRef.current.value = "";
                  inputFileRef.current.click();
                }
              }}
              variant="secondary"
              size="sm"
            >
              Change workspace logo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
