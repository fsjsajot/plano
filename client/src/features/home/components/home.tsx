import { HomeLayout } from "@/components/layout/home-layout";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useBoards } from "@/features/manage-boards/api/get-boards";
import { HomeContextProvder, useHomeContext } from "./home-context";

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
  const { selectedWorkspaceId, selectedWorkspace } = useHomeContext();
  const { data: boards, isLoading: isBoardsLoading } = useBoards({
    workspaceId: selectedWorkspaceId,
  });

  return (
    <div className="flex gap-4 w-full max-w-6xl mx-auto">
      <div className="px-4     h-60 min-w-48 mt-8">
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
        <div className="px-8 py-8 ">
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

        <div className="flex flex-nowrap max-w-5xl">
          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 p-4">
              <div className="w-80 h-96 border rounded">
                <h1 className="bg-accent text-center">New</h1>
                <ScrollArea className="h-40 p-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis consequuntur, voluptatum illum officiis aspernatur
                  quasi id? Necessitatibus consequatur omnis, non ducimus
                  tempora dicta porro soluta quaerat maxime? Alias, sint odio.
                </ScrollArea>
              </div>

              <div className="w-80 h-96 border rounded">
                <h1 className="bg-accent text-center">New</h1>
                <ScrollArea className="h-40 p-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis consequuntur, voluptatum illum officiis aspernatur
                  quasi id? Necessitatibus consequatur omnis, non ducimus
                  tempora dicta porro soluta quaerat maxime? Alias, sint odio.
                </ScrollArea>
              </div>

              <div className="w-80 h-96 border rounded">
                <h1 className="bg-accent text-center">New</h1>
                <ScrollArea className="h-40 p-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis consequuntur, voluptatum illum officiis aspernatur
                  quasi id? Necessitatibus consequatur omnis, non ducimus
                  tempora dicta porro soluta quaerat maxime? Alias, sint odio.
                </ScrollArea>
              </div>

              <div className="w-80 h-96 border rounded">
                <h1 className="bg-accent text-center">New</h1>
                <ScrollArea className="h-40 p-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis consequuntur, voluptatum illum officiis aspernatur
                  quasi id? Necessitatibus consequatur omnis, non ducimus
                  tempora dicta porro soluta quaerat maxime? Alias, sint odio.
                </ScrollArea>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};