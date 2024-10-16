import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { X } from "@phosphor-icons/react";

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

const entrySchema = z.string().min(1).email();

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
  const [emailInput, setEmailInput] = useState("");
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

  const handleAddEntry = () => {
    const validate = entrySchema.safeParse(emailInput);

    if (validate.success) {
      if ((memberEmails || []).concat(emails).includes(emailInput)) {
        console.error("Email already exists.");
        toast.error("Email already exists.");
      } else {
        setEmails((currentEmails) => [...currentEmails, emailInput]);
        setEmailInput("");
      }
    } else {
      console.error(validate.error.issues[0]);
      toast.error(validate.error.issues[0].message);
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
          <div className="flex gap-4">
            <Input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email address"
            />
            <Button onClick={handleAddEntry} size="sm" variant="secondary">
              Add
            </Button>
          </div>
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
