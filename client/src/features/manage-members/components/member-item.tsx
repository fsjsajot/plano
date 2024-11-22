import { Button } from "@/components/ui/button";
import { User, Workspace } from "@/types/entities";
import { X } from "@phosphor-icons/react";

interface MemberItemProps {
  user: User;
  workspace: Workspace;
  handleRemoveMember: () => void;
}

export const MemberItem = ({
  user,
  handleRemoveMember,
  workspace,
}: MemberItemProps) => {
  return (
    <div className="flex w-full  p-4 border-b">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold">
          {user.name}
          {user.id === workspace.owner.id && (
            <span className="ml-2 bg-blue-300 text-blue-950 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded  max-w-fit">
              Admin
            </span>
          )}
        </h4>
        <p className="text-sm">{user.email}</p>
      </div>

      {user.id !== workspace.owner.id && (
        <div className="flex flex-1 justify-end">
          <Button onClick={handleRemoveMember} variant="secondary" size="sm">
            <X className="mr-2 w-4 h-4" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
};
