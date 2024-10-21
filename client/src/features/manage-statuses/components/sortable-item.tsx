import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DotsSixVertical,
  DotsThree,
  Pencil,
  ToggleRight,
  Trash,
} from "@phosphor-icons/react";

import { Status } from "@/types/entities";
import { cn } from "@/lib/utils";

import { StatusListAction } from "./sortable-container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
  status: Status;
  setRowAction: React.Dispatch<
    React.SetStateAction<StatusListAction | undefined>
  >;
  toggleVisibility: () => void;
}

export const SortableItem = ({
  status,
  setRowAction,
  toggleVisibility,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.id });

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex border-b  px-4 py-2 items-center"
    >
      <Button
        {...attributes}
        {...listeners}
        variant="outline"
        size="icon"
        className="mr-4 w-auto h-auto p-2"
      >
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
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <DotsThree className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                setRowAction({
                  type: "edit",
                  data: status,
                })
              }
            >
              <Pencil className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleVisibility}>
              <ToggleRight className="mr-2" />
              {`Mark as  ${status.visibility ? "Hidden" : "Visible"}`}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setRowAction({
                  type: "delete",
                  data: status,
                })
              }
            >
              <Trash className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
