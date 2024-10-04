import { DotsSixVertical } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Status } from "@/types/entities";
import { Button } from "../ui/button";

export const SortableOverlayItem = ({ status }: { status: Status }) => {
  return (
    <div className="flex border-b bg-neutral-200 px-4 py-2 items-center">
      <Button variant="outline" size="icon" className="mr-4 w-auto h-auto p-2">
        <DotsSixVertical className="w-5 h-5" />
      </Button>

      <div className="flex flex-col flex-1 gap-1">
        <p className="text-md font-medium">{status.name}</p>
        <span
          className={cn(
            " text-xs font-medium me-2 px-2.5 py-0.5 rounded  max-w-fit",
            {
              "bg-green-300 text-green-950 dark:bg-green-900 dark:text-green-300":
                status.visibility,
              "bg-red-300 text-red-950 dark:bg-red-900 dark:text-red-300":
                !status.visibility,
            }
          )}
        >
          {status.visibility ? "Visible" : "Hidden"}
        </span>
      </div>
    </div>
  );
};
