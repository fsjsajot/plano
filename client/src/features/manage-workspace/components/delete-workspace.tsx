import { useState } from "react";

import { Workspace } from "@/types/entities";
import { DeleteWorkspaceDialog } from "@/features/user-workspaces/components/delete-workspace-dialog";
import { Button } from "@/components/ui/button";

export const DeleteWorkspace = ({ workspace }: { workspace: Workspace }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full min-w-96">
      <h3 className="border-b pb-2 text-md leading-normal tracking-tight">
        Delete workspace
      </h3>

      <div className="space-y-2 maw-w-lg pt-2">
        <p className="text-sm">
          Once you delete your workspace, there is no going back. Please be
          certain.
        </p>
        <Button size="sm" onClick={() => setOpen(true)} variant="destructive">
          Delete your workspace
        </Button>
      </div>

      {open && (
        <DeleteWorkspaceDialog
          open={open}
          onOpenChange={() => setOpen(false)}
          workspace={workspace}
          redirect
        />
      )}
    </div>
  );
};
