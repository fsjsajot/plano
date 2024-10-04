import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { CreateStatusDialog } from "@/components/statuses/create-status-dialog";
import { SortableContainer } from "@/components/statuses/sortable-container";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useStatusesData } from "@/hooks/statuses/useStatusesData";

export default function ManageStatuses() {
  const { workspaceId = "" } = useParams();
  const { data: items = [], isLoading } = useStatusesData({ id: workspaceId });

  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.position - b.position);
  }, [items]);

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
              Manage Statuses
            </h3>
            <p className="text-sm text-muted-foreground">
              Create and manage board item statuses
            </p>
          </div>

          <div className="flex flex-1 justify-end">
            <CreateStatusDialog
              nextPosition={
                sortedItems.length === 0
                  ? 1
                  : sortedItems[sortedItems.length - 1].position + 1
              }
            />
          </div>
        </div>
      </div>

      <div className="border mx-4 md:mx-8 my-8 max-w-3xl">
        <p className="p-4 text-sm text-muted-foreground">
          Configure the sequence of the statuses that will be displayed in the
          public home page.
        </p>

        <SortableContainer
          workspaceId={workspaceId}
          items={sortedItems}
          setItems={() => {}}
        />
      </div>
    </div>
  );
}
