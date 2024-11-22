import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router-dom";

import { HomeLayout } from "@/components/layout/home-layout";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useHomeContext } from "@/features/home/components/home-context";
import useDebounce from "@/hooks/use-debounce";
import { useBoard } from "../api/get-board";
import { usePosts } from "../api/get-posts";
import { BoardItem } from "./board-item";
import { BoardLayout } from "./board-layout";

const BoardContent = ({ boardId }: { boardId: string }) => {
  const { selectedWorkspaceId } = useHomeContext();
  const [orderBy, setOrderBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const { data: board, isLoading } = useBoard({
    workspaceId: selectedWorkspaceId,
    boardId: Number(boardId),
    queryConfig: {
      throwOnError: true,
    },
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: items = [],
    fetchNextPage,
    isLoading: isPostsLoading,
  } = usePosts({
    workspaceId: selectedWorkspaceId,
    boardId: Number(boardId),
    orderBy,
    query: debouncedSearchTerm,
  });

  const { ref, inView } = useInView({
    threshold: 0.4,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-dvh h-full w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <HomeLayout key={boardId}>
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
            <Input
              onChange={(event) => setSearchTerm(event.target.value)}
              value={searchTerm}
              placeholder="Search posts"
              className="w-80"
            />
            <div className="flex-1  justify-end flex gap-4 items-center">
              <Label>Sorted by:</Label>

              <Select defaultValue={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest (default)</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="top">Top Votes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col">
            {isPostsLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner className="w-10 h-10" />
              </div>
            )}
            {!isPostsLoading && items.length === 0 && (
              <div className="border border-dashed">
                <div className="flex p-4 justify-center items-center gap-4">
                  <h4>No posts to display</h4>
                </div>
              </div>
            )}

            {items.length > 0 &&
              items.map((item) => (
                <BoardItem
                  userId={user!.id}
                  workspaceId={selectedWorkspaceId!}
                  item={item}
                  key={item.id}
                  orderBy={orderBy}
                />
              ))}

            <div ref={ref}></div>
          </div>
        </div>
      </BoardLayout>
    </HomeLayout>
  );
};

export const Board = () => {
  const { boardId = "" } = useParams();

  return <BoardContent key={boardId} boardId={boardId} />;
};
