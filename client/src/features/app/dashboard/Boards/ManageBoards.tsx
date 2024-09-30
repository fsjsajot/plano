import { useParams } from "react-router-dom";

import { BoardTableContainer } from "@/components/boards/BoardTableContainer";
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";
import { useBoardsData } from "@/hooks/boards/useBoardsData";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ManageBoards() {
  const { workspaceId = "" } = useParams();
  const { data, isLoading } = useBoardsData({ id: workspaceId });

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

      <BoardTableContainer items={data} />
    </div>
  );
}
