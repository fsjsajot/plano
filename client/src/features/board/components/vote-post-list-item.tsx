import { CaretUp } from "@phosphor-icons/react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCastVote } from "@/features/post/api/cast-vote";
import { useUncastVote } from "@/features/post/api/uncast-vote";
import { BoardItem, ItemVote } from "@/types/entities";
import { QueryBoardItems } from "../api/get-posts";

interface VotePostProps {
  userId: number;
  workspaceId: number;
  boardId: number;
  itemId: number;
  orderBy: string;
  item: BoardItem;
}

export const VotePostListItem = ({
  userId,
  boardId,
  itemId,
  workspaceId,
  orderBy,
  item,
}: VotePostProps) => {
  const queryClient = useQueryClient();

  const { mutate: castVote } = useCastVote({
    mutationConfig: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: ["items"],
        });

        let oldData = queryClient.getQueryData<InfiniteData<QueryBoardItems>>([
          "items",
          variables.workspaceId,
          variables.boardId,
          orderBy,
        ]);

        if (oldData) {
          const newPages = oldData?.pages.map((page) => {
            const data = page.data.map((item) => {
              if (item.id === variables.itemId) {
                // temporary vote object to make optimistic update to work
                const voteObject: ItemVote = {
                  id: Math.floor(Date.now() * Math.random()), // temporary id
                  boardItemId: variables.itemId,
                  userId: userId,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                return {
                  ...item,
                  votes: !!item.votes
                    ? [...item.votes, voteObject]
                    : [voteObject],
                };
              } else {
                return item;
              }
            });

            return {
              ...page,
              data,
            };
          });

          const newData = {
            ...oldData,
            pages: newPages,
          };

          queryClient.setQueryData<InfiniteData<QueryBoardItems>>(
            ["items", variables.workspaceId, variables.boardId, orderBy],
            newData
          );
        }

        return { oldData, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          oldData?: InfiniteData<QueryBoardItems>;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          ["items", ctx.variables.workspaceId, ctx.variables.boardId, orderBy],
          ctx.oldData
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, _variables) => {
        queryClient.invalidateQueries({
          queryKey: ["items"],
        });
      },
    },
  });

  const { mutate: uncastVote } = useUncastVote({
    mutationConfig: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: ["items"],
        });

        let oldData = queryClient.getQueryData<InfiniteData<QueryBoardItems>>([
          "items",
          variables.workspaceId,
          variables.boardId,
          orderBy,
        ]);

        if (oldData) {
          const newPages = oldData?.pages.map((page) => {
            const data = page.data.map((item) => {
              if (item.id === variables.itemId) {
                return {
                  ...item,
                  votes: item.votes.filter(
                    (vote) => vote.id !== variables.voteId
                  ),
                };
              } else {
                return item;
              }
            });

            return {
              ...page,
              data,
            };
          });

          const newData = {
            ...oldData,
            pages: newPages,
          };

          queryClient.setQueryData<InfiniteData<QueryBoardItems>>(
            ["items", variables.workspaceId, variables.boardId, orderBy],
            newData
          );
        }

        return { oldData, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          oldData: InfiniteData<QueryBoardItems>;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          ["items", ctx.variables.workspaceId, ctx.variables.boardId, orderBy],
          ctx.oldData
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, _variables) => {
        queryClient.invalidateQueries({
          queryKey: ["items"],
        });
      },
    },
  });

  const hasVotedObject = useMemo(() => {
    if (!item?.votes || item.votes.length === 0) return null;

    if (item) {
      return item.votes.find((vote) => vote.userId === userId);
    }

    return null;
  }, [item?.votes]);

  return (
    <Button
      onClick={() =>
        hasVotedObject
          ? uncastVote({
              workspaceId,
              boardId,
              itemId,
              voteId: hasVotedObject.id,
            })
          : castVote({
              workspaceId,
              boardId,
              itemId,
            })
      }
      className={hasVotedObject ? "bg-accent" : ""}
      size="sm"
      variant="outline"
    >
      <CaretUp className="mr-1" />
      {item.votes.length}
    </Button>
  );
};
