import { Board } from "@/types/entities";

export interface BoardRowAction {
    type: "edit" | "delete";
    data: Board;
  }