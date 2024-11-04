import { SidebarItem } from "@/components/layout/sidebar-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHomeContext } from "@/features/home/components/home-context";
import { useBoards } from "@/features/manage-boards/api/get-boards";
import { cn } from "@/lib/utils";
import { CaretUp, FunnelSimple } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

export const Boards = ({}) => {
  const { boardId } = useParams();
  const { selectedWorkspaceId } = useHomeContext();
  const {
    data: boards,
    isLoading: isBoardsLoading,
    isSuccess,
  } = useBoards({
    workspaceId: selectedWorkspaceId,
  });

  if (
    isSuccess &&
    boards &&
    boardId &&
    !boards.find(({ id }) => id === Number(boardId))
  ) {
    alert;

    //throw new Error("Board not found!");
  }

  const board = useMemo(() => {
    if (isSuccess && boards) {
      return boards.find(({ id }) => id === Number(boardId))!;
    }
  }, [isSuccess, boards, boardId]);

  const Item = () => (
    <div className="border-t">
      <div className="flex flex-col">
        <div className="flex  px-4 first:pt-4 items-center gap-4">
          <div>
            <Button variant="outline" size="sm">
              <CaretUp className="mr-2" />1
            </Button>
          </div>

          <div>
            <Link to="/">
              <h4 className="font-semibold"> Post Title</h4>
              <p className="text-sm font-normal line-clamp-2">
                Post description Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Totam pariatur tenetur, sunt rerum sapiente
                excepturi dignissimos accusantium soluta amet nostrum a quod
                doloremque repudiandae eveniet cumque exercitationem sequi,
                mollitia deleniti.
              </p>
            </Link>
          </div>
        </div>
        <div className="flex justify-end pb-4 mt-2 px-2">
          Posted by Jhefrey Sajot
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 w-full max-w-6xl mx-auto">
      <div className="px-4     h-60 min-w-48 mt-8">
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
      <div className="flex-1">
        <div className="px-8 py-8 space-y-8 ">
          {board && (
            <div className="flex w-full items-center">
              <div className="flex flex-col">
                <h4 className="font-bold">{board.name}</h4>
                <p className="text-sm">{board.description}</p>
              </div>

              <div className="flex-1 justify-end flex">
                <Button>Create Post</Button>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Input placeholder="Search posts" className="w-64" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FunnelSimple className="mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col">
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
          </div>
        </div>
      </div>
    </div>
  );
};
