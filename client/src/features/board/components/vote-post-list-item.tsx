import { CaretUp } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCastVote } from "@/features/post/api/cast-vote";
import { useUncastVote } from "@/features/post/api/uncast-vote";
import { Board, BoardItem, ItemVote } from "@/types/entities";

interface VotePostProps {
  userId: number;
  workspaceId: number;
  boardId: number;
  itemId: number;
  item: BoardItem;
}

export const VotePostListItem = ({
  userId,
  boardId,
  itemId,
  workspaceId,
  item,
}: VotePostProps) => {
  const queryClient = useQueryClient();

  const { mutate: castVote } = useCastVote({
    mutationConfig: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: [
            "workspace_boards",
            variables.workspaceId,
            variables.boardId,
          ],
        });

        let previousBoard = queryClient.getQueryData<Board>([
          "workspace_boards",
          variables.workspaceId,
          variables.boardId,
        ]);

        if (previousBoard && previousBoard.items) {
          const itemIndex = previousBoard.items.findIndex(
            ({ id }) => id === variables.itemId
          );
          let item = previousBoard.items[itemIndex];

          if (!item) throw new Error("Item not found!");

          // temporary vote object to make optimistic update to work
          const voteObject: ItemVote = {
            id: Math.floor(Date.now() * Math.random()), // temporary id
            boardItemId: variables.itemId,
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          item.votes = !!item.votes
            ? [...item.votes, voteObject]
            : [voteObject];

          previousBoard.items[itemIndex] = item;
        }

        queryClient.setQueryData(
          ["workspace_boards", variables.workspaceId, variables.boardId],
          previousBoard
        );

        return { previousBoard, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          previousBoard: Board;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          [
            "workspace_boards",
            ctx.variables.workspaceId,
            ctx.variables.boardId,
          ],
          ctx.previousBoard
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            "workspace_boards",
            variables.workspaceId,
            variables.boardId,
          ],
        });
      },
    },
  });

  const { mutate: uncastVote } = useUncastVote({
    mutationConfig: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: [
            "workspace_boards",
            variables.workspaceId,
            variables.boardId,
          ],
        });

        let previousBoard = queryClient.getQueryData<Board>([
          "workspace_boards",
          variables.workspaceId,
          variables.boardId,
        ]);

        if (previousBoard && previousBoard.items) {
          const itemIndex = previousBoard.items.findIndex(
            ({ id }) => id === variables.itemId
          );
          let item = previousBoard.items[itemIndex];

          if (!item) throw new Error("Item not found!");

          item.votes = item.votes.filter(
            (vote) => vote.id !== variables.voteId
          );
        }

        queryClient.setQueryData(
          ["workspace_boards", variables.workspaceId, variables.boardId],
          previousBoard
        );

        return { previousBoard, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          previousBoard: Board;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          [
            "workspace_boards",
            ctx.variables.workspaceId,
            ctx.variables.boardId,
          ],
          ctx.previousBoard
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            "workspace_boards",
            variables.workspaceId,
            variables.boardId,
          ],
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
