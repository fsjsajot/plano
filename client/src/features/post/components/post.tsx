import { Pencil, Trash } from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";

import { HomeLayout } from "@/components/layout/home-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { BoardLayout } from "@/features/board/components/board-layout";
import { usePostAttachments } from "../api/get-files";
import { usePost } from "../api/get-post";
import { Attachments } from "./attachments";
import { CommentSection } from "./comment-section";
import { DeletePostDialog } from "./delete-post-dialog";
import { VotePost } from "./vote-post";

export const Post = () => {
  const { workspaceId = "", boardId = "", itemId = "" } = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const { data: item, isLoading } = usePost({
    workspaceId: Number(workspaceId),
    boardId: Number(boardId),
    itemId: Number(itemId),
  });

  const { data: files, isLoading: isFilesLoading } = usePostAttachments({
    workspaceId: Number(workspaceId),
    boardId: Number(boardId),
    itemId: Number(itemId),
  });

  if (isLoading || isFilesLoading || isUserLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  if (!item || !user) {
    throw new Error("Post not found!");
  }

  return (
    <HomeLayout>
      <BoardLayout>
        <div className="flex flex-col my-8">
          <h3 className="text-lg font-semibold border-b p-2 mb-4">
            {item.title}
          </h3>
          <div className="flex">
            <div className="mr-4">
              <VotePost
                workspaceId={Number(workspaceId)}
                boardId={Number(boardId)}
                itemId={Number(itemId)}
                userId={user.id}
                item={item}
              />
            </div>
            <div className="flex-1">
              <p>{item.description}</p>
            </div>
          </div>

          {files && files.length > 0 && (
            <Attachments
              files={files}
              workspaceId={Number(workspaceId)}
              boardId={Number(boardId)}
              itemId={Number(itemId)}
            />
          )}

          <div className="my-4 flex items-center gap-2 border-b py-2 border-dashed">
            {user && user.id === item.author.id && (
              <Fragment>
                <a
                  href={`/app/${workspaceId}/boards/${boardId}/posts/${itemId}/edit`}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  <Pencil weight="light" className="mr-2" />
                  Edit post
                </a>

                <Button
                  onClick={() => setOpenDialog(true)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash weight="light" className="mr-2" />
                  Delete post
                </Button>
              </Fragment>
            )}
            <div className="flex flex-1 justify-end gap-4">
              <p className="text-sm">
                <span className="font-semibold mr-1">Status:</span>
                {item.status && item.status.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold mr-1">Posted on:</span>
                {new Intl.DateTimeFormat().format(new Date(item.createdAt))}
              </p>

              <p className="text-sm">
                <span className="font-semibold mr-1">Posted by:</span>
                {item.author.name}
              </p>
            </div>
          </div>
        </div>

        <CommentSection
          workspaceId={Number(workspaceId)}
          boardId={Number(boardId)}
          itemId={Number(itemId)}
          userId={user.id}
        />

        {openDialog && (
          <DeletePostDialog
            open={openDialog}
            onOpenChange={() => setOpenDialog(false)}
            workspaceId={Number(workspaceId)}
            boardId={Number(boardId)}
            itemId={Number(itemId)}
          />
        )}
      </BoardLayout>
    </HomeLayout>
  );
};
