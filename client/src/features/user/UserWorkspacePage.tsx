import { useWorkspaces } from "../../hooks/workspaces/useWorkspaces";
import { WorkspaceItem } from "@/components/workspace/WorkspaceItem";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import AppLayout from "../app/AppLayout";

export default function UserWorkspacePage() {
  const { workspaces } = useWorkspaces();

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

        <div className="flex flex-wrap mt-4 gap-4">
          {workspaces.map((ws) => (
            <WorkspaceItem key={ws.id} workspace={ws} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
