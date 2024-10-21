import { Link } from "react-router-dom";

import { Workspace } from "@/types/entities";
import { WorkspaceItemActionMenu } from "./workspace-item-action-menu";

export const WorkspaceItem = ({ workspace }: { workspace: Workspace }) => (
  <div className="h-32 w-52 bg-gradient-to-r from-blue-900 to-blue-700 p-2 rounded-md relative">
    <Link className="inline-block max-w-36" to={`/workspaces/${workspace.id}`}>
      <div className="h-20 p-2 text-primary-foreground line-clamp-3">
        {workspace.name}
      </div>
    </Link>
    <WorkspaceItemActionMenu workspace={workspace} />
  </div>
);
