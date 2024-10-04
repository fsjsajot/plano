import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";

import { DeleteStatusDialog } from "./delete-status-dialog";
import { EditStatusDialog } from "./edit-status-dialog";
import { SortableItem } from "./sortable-item";
import { SortableOverlayItem } from "./sortable-overlay-item";
import { useUpdateStatusMutation } from "@/hooks/statuses/useUpdateStatusMutation";
import { Status } from "@/types/entities";

interface SortableContainerProps {
  items: Status[];
  setItems: React.Dispatch<React.SetStateAction<Status[]>>;
  workspaceId: string;
}

export interface StatusListAction {
  type: "edit" | "delete" | "mark-visibility";
  data: Status;
}

export const SortableContainer = ({
  items,
  workspaceId,
}: SortableContainerProps) => {
  const [rowAction, setRowAction] = useState<StatusListAction>();
  const [activeItem, setActiveItem] = useState<{
    id: UniqueIdentifier;
    data?: Status;
  } | null>(null);
  const { mutate } = useUpdateStatusMutation({
    onSuccessFn: () => {
      setActiveItem(null);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveItem({
      id: event.active.id,
      data: items.find(({ id }) => event.active.id === id),
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;

    const sourceItem = items.find(({ id }) => id === active.id);
    const destinationItem = items.find(({ id }) => id === over?.id);

    if (active.id !== over?.id && destinationItem && sourceItem) {
      const destinationIndex = over?.data?.current?.sortable?.index;
      const sourceIndex = active.data?.current?.sortable?.index;

      const previousPosition = items[destinationIndex - 1]
        ? items[destinationIndex - 1].position
        : 0;

      const nextPosition = items[destinationIndex + 1]
        ? items[destinationIndex + 1].position
        : destinationItem.position + 1;

      const droppedPosition =
        sourceIndex > destinationIndex ? previousPosition : nextPosition;
      const updatedPosition = (droppedPosition + destinationItem.position) / 2;

      mutate({
        workspaceId,
        statusId: sourceItem.id,
        values: {
          ...sourceItem,
          position: updatedPosition,
        },
      });
    }
  };

  const handleToggleVisibility = (status: Status) => {
    mutate({
      workspaceId,
      statusId: status.id,
      values: {
        ...status,
        visibility: !status.visibility,
      },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {items.length === 0 && (
          <p className="text-md text-center p-4 text-muted-foreground">
            No status data to display
          </p>
        )}

        {items.length > 0 &&
          items.map((status, idx) => (
            <SortableItem
              toggleVisibility={() => handleToggleVisibility(status)}
              setRowAction={setRowAction}
              key={`${status.id}-${idx}`}
              status={status}
            />
          ))}

        {createPortal(
          <DragOverlay
            dropAnimation={{
              duration: 0,
            }}
          >
            {activeItem && activeItem.data ? (
              <SortableOverlayItem
                status={activeItem.data}
                key={activeItem.id}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}

        {rowAction && rowAction.type === "edit" && (
          <EditStatusDialog
            workspaceId={workspaceId}
            onOpenChange={() => setRowAction(undefined)}
            open={rowAction.type === "edit"}
            status={rowAction.data}
          />
        )}

        {rowAction && rowAction.type === "delete" && (
          <DeleteStatusDialog
            workspaceId={workspaceId}
            onOpenChange={() => setRowAction(undefined)}
            open={rowAction.type === "delete"}
            statusId={rowAction.data.id}
          />
        )}
      </SortableContext>
    </DndContext>
  );
};
