import { Link } from "react-router-dom";

import { BoardItem as BoardItemType } from "@/types/entities";
import { VotePostListItem } from "./vote-post-list-item";

interface BoardItemProps {
  item: BoardItemType;
  workspaceId: number;
  userId: number;
  orderBy: string;
}

export const BoardItem = ({
  item,
  workspaceId,
  userId,
  orderBy,
}: BoardItemProps) => {
  return (
    <div className="border-t">
      <div className="flex flex-col">
        <div className="flex  px-4 first:pt-4 items-center gap-4">
          <div>
            <VotePostListItem
              workspaceId={workspaceId}
              boardId={item.boardId}
              itemId={item.id}
              userId={userId}
              item={item}
              orderBy={orderBy}
            />
          </div>

          <div>
            <Link
              to={`/app/${workspaceId}/boards/${item.boardId}/posts/${item.id}`}
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
};
