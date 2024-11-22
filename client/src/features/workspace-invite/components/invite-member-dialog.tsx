import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { useCreateWorkspaceInvite } from "../api/create-workspace-invite";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const entrySchema = z.object({
  email: z.string().min(1).email(),
});
type EntrySchemaType = z.infer<typeof entrySchema>;

interface InviteMemberDialogProps {
  memberEmails: string[];
  workspaceId: string;
  open: boolean;
  onOpenChange: () => void;
}

export const InviteMemberDialog = ({
  workspaceId,
  memberEmails,
  open,
  onOpenChange,
}: InviteMemberDialogProps) => {
  const [emails, setEmails] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { mutate: createWorkspaceInvite, isPending } = useCreateWorkspaceInvite(
    {
      mutationConfig: {
        onSuccess: () => onOpenChange(),
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["workspace_members"],
          });
        },
      },
    }
  );

  const allEmails = (memberEmails || []).concat(emails);
  const form = useForm<EntrySchemaType>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      email: "",
    },
  });

  const onAdd = ({ email }: EntrySchemaType) => {
    if (allEmails.includes(email)) {
      toast.error("Email already exists.");
    } else {
      setEmails((currentEmails) => [...currentEmails, email]);
      form.reset();
    }
  };

  const handleRemoveEntry = (email: string) =>
    setEmails((currentEmails) =>
      currentEmails.filter((currentEmail) => currentEmail !== email)
    );

  const handleSendInvites = () =>
    createWorkspaceInvite({ workspaceId, data: { emails, inviteType: 1 } });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite to Workspace</DialogTitle>
          <DialogDescription className="sr-only">
            Invite someone to collaborate in this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onAdd)}
              className="flex gap-4 items-center"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <div className="flex flex-1">
                          <Input
                            placeholder="Enter email address"
                            type="email"
                            {...field}
                          />
                        </div>

                        <Button size="sm" variant="secondary">
                          Add
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div
          className={cn({
            "py-4": emails.length > 0,
          })}
        >
          {emails.map((email) => (
            <div className="flex items-center gap-2" key={email}>
              <p className="flex-1 text-sm font-bold">{email}</p>
              <Button
                onClick={() => handleRemoveEntry(email)}
                variant="ghost"
                size="sm"
              >
                <X className="mr-2" /> Remove
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            disabled={emails.length === 0 || isPending}
            onClick={handleSendInvites}
            type="submit"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-1">
                <LoadingSpinner />
                Sending...
              </span>
            ) : (
              "Send Invites"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
