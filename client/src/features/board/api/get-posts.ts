import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

import { http } from "@/lib/http";
import { QueryConfig } from "@/lib/react-query";
import { BoardItem, PaginatedBoardItem } from "@/types/entities";

export interface QueryBoardItems {
  data: BoardItem[];
  previousCursor: string | null;
  nextCursor: string | null;
}

export interface InfiniteQueryBoardItems {
  pages: QueryBoardItems[];
  pageParams: string[];
}

export const getItems = async ({
  boardId,
  orderBy,
  pageParam,
  workspaceId,
  query
}: {
  workspaceId: number;
  boardId: number;
  pageParam: string;
  orderBy: string;
  query?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("order_by", orderBy);

  if (pageParam) {
    searchParams.append("cursor", pageParam);
  }

  if (query) {
    searchParams.append("query", query);
  }

  const response = await http.get<PaginatedBoardItem>(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items?${searchParams.toString()}`
  );

  return {
    data: response.data.data,
    previousCursor: response.data.meta.prevCursor,
    nextCursor: response.data.meta.nextCursor,
  };
};

export const getItemsOptions = (
  orderBy: string,
  workspaceId?: number,
  boardId?: number,
  query?: string
) => {
  return infiniteQueryOptions({
    queryKey: ["items", workspaceId, boardId, orderBy, query],
    queryFn: ({ pageParam }) =>
      getItems({
        boardId: boardId!,
        workspaceId: workspaceId!,
        pageParam,
        orderBy,
        query,
      }),
    enabled: !!workspaceId && !!boardId,
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    select: (data) => data.pages.flatMap(page => page.data)
  });
};

type UsGetPostsOptions = {
  workspaceId?: number;
  boardId?: number;
  orderBy: string;
  query?: string;
  queryConfig?: QueryConfig<typeof getItemsOptions>;
};

export const usePosts = ({
  workspaceId,
  boardId,
  orderBy,
  queryConfig,
  query,
}: UsGetPostsOptions) => {
  return useInfiniteQuery({
    ...getItemsOptions(orderBy, workspaceId, boardId, query),
    ...queryConfig,
  });
};
