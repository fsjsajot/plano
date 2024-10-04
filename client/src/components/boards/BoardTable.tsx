import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import { BoardRowAction } from "./BoardTableContainer";
import { EditBoardDialog } from "./EditBoardDialog";
import { DeleteBoardDialog } from "./DeleteBoardDialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowAction?: BoardRowAction;
  setRowAction: (action?: BoardRowAction) => void;
}

export const BoardTable = <TData, TValue>({
  data,
  columns,
  rowAction,
  setRowAction,
}: DataTableProps<TData, TValue>) => {
  const { workspaceId = "" } = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="py-6 px-4">
      <div className="mb-3 min-w-24 w-full max-w-72">
        <Input
          placeholder="Filter board names"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
        />
      </div>

      <div className="border rounded-md">
        <DataTable columns={columns} table={table} data={data} />
      </div>

      {rowAction && rowAction.type === "edit" && (
        <EditBoardDialog
          board={rowAction.data}
          workspaceId={workspaceId}
          onOpenChange={() => setRowAction(undefined)}
          open={rowAction.type === "edit"}
        />
      )}

      {rowAction && rowAction.type === "delete" && (
        <DeleteBoardDialog
          boardId={rowAction.data.id}
          workspaceId={workspaceId}
          onOpenChange={() => setRowAction(undefined)}
          open={rowAction.type === "delete"}
        />
      )}
    </div>
  );
};
