import { useParams } from "react-router-dom";

import { SidebarItem } from "@/components/layout/sidebar-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHomeContext } from "@/features/home/components/home-context";
import { useBoards } from "@/features/manage-boards/api/get-boards";
import { cn } from "@/lib/utils";

export const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  const { boardId } = useParams();
  const { selectedWorkspaceId } = useHomeContext();
  const { data: boards, isLoading: isBoardsLoading } = useBoards({
    workspaceId: selectedWorkspaceId,
  });

  return (
    <div className="flex gap-4 w-full max-w-6xl mx-auto">
      <div className="px-4 h-60 min-w-48 mt-8 sticky">
        <h1 className="font-bold text-sm">Boards</h1>
        <ScrollArea className="h-64 mt-2">
          {isBoardsLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner className="w-10 h-10" />
            </div>
          )}
          {boards &&
            boards.map((board) => (
              <SidebarItem
                href={`/app/${selectedWorkspaceId}/boards/${board.id}`}
                key={board.id}
                className={cn("w-full", {
                  "bg-accent": board.id === Number(boardId),
                })}
                title={board.name}
              >
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {board.name}
                </div>
              </SidebarItem>
            ))}
        </ScrollArea>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};
