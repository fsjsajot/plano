import { useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BoardTableContainer } from "./board-table-container";
import { CreateBoardDialog } from "./create-board-dialog";
import { useBoards } from "../api/get-boards";

export const ManageBoards = () => {
  const { workspaceId = "" } = useParams();
  const { data: boards = [], isLoading } = useBoards({
    workspaceId: Number(workspaceId),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border-b">
        <div className="flex p-4 items-center">
          <div className="flex flex-col">
            <h3 className={"text-xl font-medium leading-normal tracking-tight"}>
              Manage Boards
            </h3>
            <p className="text-sm text-muted-foreground">
              Start managing your workspace boards.
            </p>
          </div>

          <div className="flex flex-1 justify-end">
            <CreateBoardDialog />
          </div>
        </div>
      </div>

      <BoardTableContainer items={boards} />
    </div>
  );
};
