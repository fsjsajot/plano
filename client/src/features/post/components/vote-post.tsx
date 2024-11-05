import { CaretUp } from "@phosphor-icons/react";
import axios from "axios";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BoardItem, ItemVote } from "@/types/entities";
import { useQueryClient } from "@tanstack/react-query";
import { useCastVote } from "../api/cast-vote";
import { useUncastVote } from "../api/uncast-vote";

interface VotePostProps {
  userId: number;
  workspaceId: number;
  boardId: number;
  itemId: number;
  item: BoardItem;
}

export const VotePost = ({
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
          queryKey: ["item", variables.itemId],
        });

        let previousItem = queryClient.getQueryData<BoardItem>([
          "item",
          variables.itemId,
        ]);

        // temporary vote object to make optimistic update to work
        const voteObject: ItemVote = {
          id: Math.floor(Date.now() * Math.random()), // temporary id
          boardItemId: variables.itemId,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (previousItem) {
          previousItem.votes = !!previousItem.votes
            ? [...previousItem.votes, voteObject]
            : [voteObject];
        }

        queryClient.setQueryData(["item", variables.itemId], previousItem);

        return { previousItem, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          previousItem: BoardItem;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          ["item", ctx.variables.itemId],
          ctx.previousItem
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["item", variables.itemId],
        });
      },
    },
  });
  const { mutate: uncastVote } = useUncastVote({
    mutationConfig: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: ["item", variables.itemId],
        });

        let previousItem = queryClient.getQueryData<BoardItem>([
          "item",
          variables.itemId,
        ]);

        if (previousItem && previousItem.votes) {
          previousItem.votes = previousItem.votes.filter(
            (vote) => vote.id !== variables.voteId
          );
        }

        queryClient.setQueryData(["item", variables.itemId], previousItem);

        return { previousItem, variables };
      },

      onError: (error, _newVote, context) => {
        const ctx = context as {
          previousItem: BoardItem;
          variables: {
            workspaceId: number;
            boardId: number;
            itemId: number;
          };
        };

        queryClient.setQueryData(
          ["item", ctx.variables.itemId],
          ctx.previousItem
        );

        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data?.message);
        }

        throw error;
      },

      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["item", variables.itemId],
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
