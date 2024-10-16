import { LinkBreak, LinkSimple, UserPlus } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCreateWorkspaceInvite } from "@/features/workspace-invite/api/create-workspace-invite";
import { useDisableWorkspaceInviteLink } from "@/features/workspace-invite/api/disable-workspace-invite-link";
import { useWorkspaceInvites } from "@/features/workspace-invite/api/get-workspace-invites";
import { User } from "@/types/entities";
import { useWorkspaceMembers } from "../api/get-workspace-members";
import { useRemoveWorkspaceMember } from "../api/remove-workspace-member";
import { InviteMemberDialog } from "@/features/workspace-invite/components/invite-member-dialog";
import { MemberItem } from "./member-item";

export const ManageMembers = ({}) => {
  const [items, setItems] = useState<User[]>([]);
  const { workspaceId = "" } = useParams();
  const queryClient = useQueryClient();

  const { mutate: createInvite } = useCreateWorkspaceInvite({
    mutationConfig: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_invites"],
        });
        window.navigator.clipboard.writeText(data.inviteUrl).then(() => {
          toast.success("Link copied to clipboard.");
        });
      },
    },
  });

  const { mutate: disableInviteLink } = useDisableWorkspaceInviteLink({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_invites"],
        });
      },
    },
  });

  const { mutate: removeWorkspaceMember } = useRemoveWorkspaceMember({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace_members"],
        });
      },
    },
  });

  const { data, isLoading } = useWorkspaceMembers({ workspaceId });
  const { data: invites, isLoading: isInviteLoading } = useWorkspaceInvites({
    workspaceId,
  });

  const handleGenerateInviteLink = async () => {
    if (invites) {
      window.navigator.clipboard.writeText(invites.inviteUrl).then(() => {
        toast.success("Link copied to clipboard.");
      });
    } else {
      createInvite({
        workspaceId,
        data: {
          inviteType: 2,
        },
      });
    }
  };

  const handleDisableInviteLink = async () => {
    if (invites) {
      disableInviteLink({
        workspaceId,
        inviteId: invites.id,
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setItems(data as User[]);
    } else {
      setItems((prevItems) =>
        prevItems.filter((p) =>
          p.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    removeWorkspaceMember({ workspaceId, memberId });
  };

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const [open, setOpen] = useState(false);
  const memberEmails = useMemo(() => {
    if (data) {
      return data.map(({ email }) => email);
    }

    return [];
  }, [data]);

  if (isLoading || isInviteLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-8 py-8  border-b">
        <div className="ml-4">
          <h3 className="text-xl font-medium leading-normal tracking-tight">
            Workspace Members
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage and invite members to your workspace.
          </p>
        </div>
      </div>

      <div className="py-4 mx-12">
        <div className="flex gap-4">
          <Input
            onChange={handleChange}
            placeholder="Filter by name"
            className="max-w-96"
          />

          <div className="flex flex-1 justify-end gap-4">
            <Button size="sm" onClick={() => setOpen(true)}>
              <UserPlus className="mr-2 w-4 h-4" /> Invite workspace members
            </Button>

            <Button
              onClick={handleGenerateInviteLink}
              size="sm"
              variant="secondary"
            >
              <LinkSimple className="mr-2 w-4 h-4" /> Invite with link
            </Button>

            {invites && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDisableInviteLink}
              >
                <LinkBreak className="mr-2 w-4 h-4" /> Disable invite link
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 ">
          {items.length === 0 && (
            <div className="flex w-full justify-center p-4 border-dotted border ">
              <h4 className="text-md font-semibold">No data to display</h4>
            </div>
          )}
          {items.map((user) => (
            <MemberItem
              key={user.id}
              user={user}
              handleRemoveMember={() => handleRemoveMember(user.id)}
            />
          ))}
        </div>

        {open && (
          <InviteMemberDialog
            workspaceId={workspaceId}
            memberEmails={memberEmails}
            open={open}
            onOpenChange={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
