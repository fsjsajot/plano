import { useMemo, useState } from "react";

import { Board } from "@/types/entities";
import { columns as tableColumns } from "./columns";
import { BoardRowAction } from "../type";
import { BoardTable } from "./board-table";

interface BoardTableContainerProps {
  items: Board[];
}

export const BoardTableContainer = ({ items }: BoardTableContainerProps) => {
  const [rowAction, setRowAction] = useState<BoardRowAction>();

  const columns = useMemo(
    () => tableColumns(setRowAction, items.length > 1),
    [items]
  );

  return (
    <BoardTable
      columns={columns}
      data={items}
      setRowAction={setRowAction}
      rowAction={rowAction}
    />
  );
};
