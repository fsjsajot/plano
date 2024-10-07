import { z } from "zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
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
import { Workspace } from "@/types/entities";
import { Textarea } from "../ui/textarea";
import { useWorkspaces } from "@/hooks/workspaces/useWorkspaces";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const EditWorkspaceDetails = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const { updateWorkspace } = useWorkspaces();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateWorkspace(workspace.id, values).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["workspace", workspace.id],
        });

        toast.success("Successfully updated workspace detail.");
      });
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.data) {
          toast.error(error.response?.data?.data);
        }

        toast.error("An error occured.");
      }

      toast.error("An error occured.");
    }
  };

  return (
    <div className="w-full min-w-96">
      <h3 className="border-b pb-2 text-md leading-normal tracking-tight">
        Workspace Detail
      </h3>
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

          <div className="">
            <Button size="sm" disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-1">
                  <LoadingSpinner />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
