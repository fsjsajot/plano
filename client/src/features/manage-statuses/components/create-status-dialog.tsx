import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CreateStatusPayload,
  formSchema,
  useCreateStatus,
} from "../api/create-status";
import { Checkbox } from "@/components/ui/checkbox";

export const CreateStatusDialog = ({
  nextPosition,
}: {
  nextPosition: number;
}) => {
  const [open, setOpen] = useState(false);
  const { workspaceId = "" } = useParams();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateStatus({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_statuses", Number(workspaceId)],
        });

        form.reset();
        setOpen(false);
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },
    },
  });

  const form = useForm<CreateStatusPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      visibility: true,
    },
  });

  const onSubmit = async (values: CreateStatusPayload) => {
    const payload = {
      ...values,
      position: nextPosition,
    };

    mutate({
      workspaceId: Number(workspaceId),
      data: payload,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription className="sr-only">
            Create new status record
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
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
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Make this status visible in the home page
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button disabled={isPending} className="w-full" type="submit">
                {isPending ? (
                  <span className="inline-flex items-center gap-1">
                    <LoadingSpinner />
                    Creating...
                  </span>
                ) : (
                  "Create status"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
