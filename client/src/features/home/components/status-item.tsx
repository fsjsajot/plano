import { CaretDoubleUp } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Board, Status } from "@/types/entities";

interface StatusItemProps {
  status: Status;
  getBoard: (boardId: number) => Board | undefined;
}

export const StatusItem = ({ status, getBoard }: StatusItemProps) => {
  return (
    <div className="w-80 min-h-96 border rounded">
      <h1 className="bg-accent text-center">{status.name}</h1>

      {status.items && (
        <ScrollArea className="h-full max-h-[350px] py-2 px-4">
          <div className="flex flex-col gap-2 h-full">
            {status.items && status.items.length === 0 && (
              <div className="flex items-center justify-center h-full">
                No data available to display
              </div>
            )}

            {status.items.map((item) => (
              <Link
                key={`item-${item.id}`}
                to={`/app/${status.workspaceId}/boards/${item.boardId}/posts/${item.id}`}
                target="_blank"
              >
                <div className="border p-4 rounded flex items-center gap-3">
                  <div className="min-w-10 flex items-center gap-1">
                    <span className="inline-flex line-clamp-1">
                      {item.voteCount}
                    </span>
                    <CaretDoubleUp className="text-orange-600" weight="bold" />
                  </div>

                  <div className="space-y-4">
                    <p className="line-clamp-1 font-medium">{item.title}</p>
                    <span className="uppercase text-sm text-neutral-500">
                      {getBoard(item.boardId)?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
