import { Pencil, Trash } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { EditWorkspaceDialog } from "./EditWorkspaceDialog";
import { useState } from "react";
import { Workspace } from "@/types/entities";
import { GearIcon } from "@radix-ui/react-icons";
import { DeleteWorkspaceDialog } from "./DeleteWorkspaceDialog";

const MENU_ACTIONS = {
  edit: "edit",
  delete: "delete",
};

export const WorkspaceItemActionMenu = ({
  workspace,
}: {
  workspace: Workspace;
}) => {
  const [dialogOpen, setDialogOpen] = useState<
    Record<keyof typeof MENU_ACTIONS, boolean>
  >({
    delete: false,
    edit: false,
  });

  const handleDialogOpen = (id: string) => {
    setDialogOpen((prev) => ({ ...prev, [id]: true }));
  };

  const handleDialogClose = (id: string) => {
    setDialogOpen((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="top-3 right-3 absolute">
        <GearIcon className="w-6 h-6 hover:text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleDialogOpen(MENU_ACTIONS.edit)}>
          <div className="flex items-center gap-1">
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => handleDialogOpen(MENU_ACTIONS.delete)}
        >
          <div className="flex items-center gap-1">
            <Trash className="w-4 h-4" />
            <span>Delete</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {dialogOpen[MENU_ACTIONS.edit as keyof typeof MENU_ACTIONS] && (
        <EditWorkspaceDialog
          open={dialogOpen[MENU_ACTIONS.edit as keyof typeof MENU_ACTIONS]}
          workspace={workspace}
          onOpenChange={() => handleDialogClose(MENU_ACTIONS.edit)}
        />
      )}

      {dialogOpen[MENU_ACTIONS.delete as keyof typeof MENU_ACTIONS] && (
        <DeleteWorkspaceDialog
          open={dialogOpen[MENU_ACTIONS.delete as keyof typeof MENU_ACTIONS]}
          onOpenChange={() => handleDialogClose(MENU_ACTIONS.delete)}
          workspace={workspace}
        />
      )}
    </DropdownMenu>
  );
};
