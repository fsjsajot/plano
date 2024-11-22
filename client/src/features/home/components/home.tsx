import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { HomeLayout } from "@/components/layout/home-layout";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useBoards } from "@/features/manage-boards/api/get-boards";
import { useStatuses } from "@/features/manage-statuses/api/get-statuses";
import { echo } from "@/lib/echo";
import { HomeContextProvder, useHomeContext } from "./home-context";
import { StatusItem } from "./status-item";

export const Home = () => {
  return (
    <HomeContextProvder>
      <HomeLayout>
        <HomeContainer />
      </HomeLayout>
    </HomeContextProvder>
  );
};

export const HomeContainer = () => {
  const queryClient = useQueryClient();
  const { selectedWorkspaceId, selectedWorkspace } = useHomeContext();
  const { data: boards, isLoading: isBoardsLoading } = useBoards({
    workspaceId: selectedWorkspaceId,
  });

  const {
    data: statuses,
    isLoading: isStatusesLoading,
    isRefetching,
  } = useStatuses({
    workspaceId: selectedWorkspaceId,
    visibleOnly: true,
    loadItems: true,
  });

  const getBoard = useCallback(
    (boardId: number) => {
      if (boards) {
        return boards.find((board) => board.id === boardId);
      }
    },
    [boards]
  );

  // this is to sync up any resources created after user has been redirected to home page
  useEffect(() => {
    echo.channel("app").listen(".resource.created", () => {
      console.log("refetch resources");
      queryClient.invalidateQueries({
        queryKey: ["workspace_statuses", selectedWorkspaceId, true, true],
      });

      queryClient.invalidateQueries({
        queryKey: ["workspace_boards", selectedWorkspaceId],
      });
    });

    return () => {
      echo.channel("app").stopListening(".resource.created");
    };
  }, [selectedWorkspaceId]);

  return (
    <div className="flex gap-4 w-full max-w-6xl sm:mx-auto">
      <div className="px-4 hidden lg:block h-60 max-w-64 min-w-48 mt-8">
        <h1 className="font-bold text-sm">Boards</h1>
        <ScrollArea className="h-64">
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
                className={"w-full"}
                title={board.name}
              >
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {board.name}
                </div>
              </SidebarItem>
            ))}
        </ScrollArea>
      </div>
      <div className="flex-1">
        <div className="pr-8 py-8">
          {selectedWorkspace && (
            <div className="ml-4 flex items-center gap-4">
              <Avatar className="h-14 w-14 rounded-md">
                <AvatarImage
                  src={selectedWorkspace.logoUrl}
                  alt="workspace logo"
                />
                <AvatarFallback className="text-2xl rounded-md">
                  {selectedWorkspace.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="text-xl font-medium leading-normal tracking-tight">
                  {selectedWorkspace.name}
                </h3>

                {selectedWorkspace.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedWorkspace.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex max-w-5xl pr-4">
          <ScrollArea className="w-full">
            {(isStatusesLoading || isRefetching) && (
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner className="w-10 h-10" />
              </div>
            )}

            <div className="flex space-x-4 p-4">
              {statuses &&
                statuses
                  .sort((a, b) => a.position - b.position)
                  .map((status) => (
                    <StatusItem
                      getBoard={getBoard}
                      key={status.id}
                      status={status}
                    />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
