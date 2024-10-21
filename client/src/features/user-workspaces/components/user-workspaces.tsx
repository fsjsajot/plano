import { AppLayout } from "@/components/layout/app-layout";
import { useWorkspaces } from "../api/get-workspaces";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { WorkspaceItem } from "./workspace-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function UserWorkspacePage() {
  const { data: workspaces = [], isLoading: isWorkspacesLoading } =
    useWorkspaces();

  if (isWorkspacesLoading) {
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex w-full max-w-[90vw] mx-auto flex-col mt-8">
        <div className="flex items-center">
          <h3 className={"font-medium leading-normal tracking-tight"}>
            Your workspaces
          </h3>

          <div className="flex-1 flex justify-end">
            <CreateWorkspaceDialog />
          </div>
        </div>
        <div className="flex flex-wrap mt-4 gap-4 mx-4">
          {workspaces.map((ws) => (
            <WorkspaceItem key={ws.id} workspace={ws} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
