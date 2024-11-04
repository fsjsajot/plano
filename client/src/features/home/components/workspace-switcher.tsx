import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

import { useHomeContext } from "./home-context";

export const WorkspaceSwitcher = () => {
  const { workspaces, selectedWorkspaceId = "" } = useHomeContext();

  const navigate = useNavigate();

  if (!selectedWorkspaceId) return null;

  const handleSelect = (value: string) => {
    const workspaceId = parseInt(value);

    if (isNaN(workspaceId)) {
      console.error("Not a valid workspace id");
      return new Error("Not a valid workspace id.");
    }

    return navigate(`/app/${workspaceId}`);
  };
  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={String(selectedWorkspaceId)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a workspace" />
      </SelectTrigger>
      <SelectContent>
        {workspaces &&
          workspaces.map((workspace) => (
            <SelectItem
              className="max-w-80"
              key={workspace.id}
              value={String(workspace.id)}
            >
              {workspace.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};
