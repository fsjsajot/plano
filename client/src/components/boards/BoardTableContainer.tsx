import { Board } from "@/types/entities";
import { useMemo, useState } from "react";
import { BoardTable } from "./BoardTable";
import { columns as tableColumns } from "./columns";

interface BoardTableContainerProps {
  items: Board[];
}

export interface BoardRowAction {
  type: "edit" | "delete";
  data: Board;
}

export const BoardTableContainer = ({ items }: BoardTableContainerProps) => {
  const [rowAction, setRowAction] = useState<BoardRowAction>();

  const columns = useMemo(() => tableColumns(setRowAction), []);

  return (
    <BoardTable
      columns={columns}
      data={items}
      setRowAction={setRowAction}
      rowAction={rowAction}
    />
  );
};
