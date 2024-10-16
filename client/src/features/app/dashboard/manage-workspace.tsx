import { useParams } from "react-router-dom";

import { DeleteWorkspace } from "@/components/manage-workspace/delete-workspace";
import { EditWorkspaceDetails } from "@/components/manage-workspace/edit-workspace-details";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWorkspaceData } from "@/hooks/workspaces/useWorkspaceData";

export const ManageWorkspace = ({}) => {
  const { workspaceId = "" } = useParams();
  const { data: workspace, isLoading } = useWorkspaceData({ id: workspaceId });

  if (isLoading || !workspace) {
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
            {workspace?.name}
          </h3>
          {workspace.description && (
            <p className="text-sm text-muted-foreground">
              {workspace.description}
            </p>
          )}
        </div>
      </div>

      <div className="mx-8 mt-8 space-y-8">
        <EditWorkspaceDetails workspace={workspace} />
        <DeleteWorkspace workspace={workspace} />
      </div>
    </div>
  );
};
