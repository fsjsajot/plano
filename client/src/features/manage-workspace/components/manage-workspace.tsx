import { useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspace } from "@/features/manage-workspace/api/get-workspace";
import { EditWorkspaceDetails } from "./edit-workspace-details";
import { DeleteWorkspace } from "./delete-workspace";

export const ManageWorkspace = ({}) => {
  const { workspaceId = "" } = useParams();
  const { data: workspace, isLoading } = useWorkspace({
    workspaceId: Number(workspaceId),
  });

  if (isLoading || !workspace) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="px-8 py-8 ">
        <div className="ml-4 flex items-center gap-4">
          <Avatar className="h-14 w-14 rounded-md">
            <AvatarImage src={workspace.logoUrl} alt="workspace logo" />
            <AvatarFallback className="text-2xl rounded-md">B</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-xl font-medium leading-normal tracking-tight">
              {workspace?.name}
            </h3>

            {workspace.description && (
              <p className="text-sm text-muted-foreground">
                {workspace.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-8 space-y-8">
        <EditWorkspaceDetails workspace={workspace} />
        <DeleteWorkspace workspace={workspace} />
      </div>
    </div>
  );
};
