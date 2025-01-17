import {
  ArrowDown,
  ArrowUp,
  CaretUpDown,
  DotsThree,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";

import type { Board } from "@/types/entities";
import { BoardRowAction } from "../type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export const columns = (
  setRowAction: (action: BoardRowAction) => void,
  allowDelete?: boolean
): ColumnDef<Board>[] => {
  return [
    {
      accessorKey: "name",
      size: 500,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <CaretUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },

      cell: ({ row }) => {
        return <div className="text-left ml-4">{row.original.name}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 1000,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <CaretUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      size: 200,

      cell: ({ row }) => {
        const createdDate = new Date(row.original.createdAt);
        return (
          <div className="text-left ml-4">{formatter.format(createdDate)}</div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Updated At
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <CaretUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      size: 200,
      cell: ({ row }) => {
        const updatedDate = new Date(row.original.updatedAt);
        return (
          <div className="text-left ml-4">{formatter.format(updatedDate)}</div>
        );
      },
    },
    {
      id: "actions",
      size: 100,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsThree className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                onClick={() =>
                  setRowAction({
                    type: "edit",
                    data: row.original,
                  })
                }
              >
                <Pencil className="mr-2" />
                Edit
              </DropdownMenuItem>
              {allowDelete && (
                <DropdownMenuItem
                  onClick={() =>
                    setRowAction({
                      type: "delete",
                      data: row.original,
                    })
                  }
                >
                  <Trash className="mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
