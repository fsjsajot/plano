import { FunnelSimple } from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { useHomeContext } from "@/features/home/components/home-context";
import { BoardItem } from "@/types/entities";
import { useBoard } from "../api/get-board";
import { BoardLayout } from "./board-layout";
import { HomeLayout } from "@/components/layout/home-layout";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { VotePostListItem } from "./vote-post-list-item";

export const Board = ({}) => {
  const { boardId = "" } = useParams();
  const { selectedWorkspaceId } = useHomeContext();

  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const { data: board, isLoading } = useBoard({
    workspaceId: selectedWorkspaceId,
    boardId: Number(boardId),
    queryConfig: {
      throwOnError: true,
    },
  });

  if (isLoading || isUserLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  const Item = ({ item }: { item: BoardItem }) => (
    <div className="border-t">
      <div className="flex flex-col">
        <div className="flex  px-4 first:pt-4 items-center gap-4">
          <div>
            <VotePostListItem
              workspaceId={selectedWorkspaceId!}
              boardId={item.boardId}
              itemId={item.id}
              userId={user!.id}
              item={item}
            />
          </div>

          <div>
            <Link
              to={`/app/${selectedWorkspaceId}/boards/${boardId}/posts/${item.id}`}
            >
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm font-normal line-clamp-2">
                {item.description}
              </p>
            </Link>
          </div>
        </div>
        <div className="flex justify-end items-center gap-4  pb-4 mt-2 px-2">
          <p className="text-sm">
            <span className="font-semibold mr-1">Posted on:</span>
            {new Intl.DateTimeFormat().format(new Date(item.createdAt))}
          </p>

          <p className="text-sm">
            <span className="font-semibold mr-1">Posted by:</span>
            {item.author.name}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <HomeLayout>
      <BoardLayout>
        <div className="px-8 py-8 space-y-8 ">
          {board && (
            <div className="flex w-full items-center">
              <div className="flex flex-col">
                <h4 className="font-bold">{board.name}</h4>
                <p className="text-sm">{board.description}</p>
              </div>

              <div className="flex-1 justify-end flex">
                <Link
                  className={buttonVariants()}
                  to={`/app/${selectedWorkspaceId}/boards/${board.id}/new`}
                >
                  Create Post
                </Link>
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
            {board && (!board.items || board.items.length === 0) && (
              <div className="border border-dashed">
                <div className="flex p-4 justify-center items-center gap-4">
                  <h4>No posts to display</h4>
                </div>
              </div>
            )}
            {board &&
              board.items &&
              board.items.map((item) => <Item item={item} key={item.id} />)}
          </div>
        </div>
      </BoardLayout>
    </HomeLayout>
  );
};
