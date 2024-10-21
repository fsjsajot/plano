import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Status } from "@/types/entities";
import {
  UpdateStatusPayload,
  formSchema,
  useUpdateStatus,
} from "../api/update-status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const EditStatusDialog = ({
  workspaceId,
  status,
  open,
  onOpenChange,
}: {
  workspaceId: string;
  status: Status;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { mutate, isPending } = useUpdateStatus({
    mutationConfig: {
      onSuccess: () => onOpenChange(),
    },
  });
  const form = useForm<UpdateStatusPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: status.name,
      visibility: status.visibility,
    },
  });

  const onSubmit = async (values: UpdateStatusPayload) => {
    mutate({
      workspaceId: Number(workspaceId),
      statusId: status.id,
      data: { ...status, ...values },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit your status record below</DialogDescription>
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
                    Updating...
                  </span>
                ) : (
                  "Update status"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
