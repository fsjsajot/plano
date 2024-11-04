import { buttonVariants } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { BoardItemFile } from "@/types/entities";
import { DownloadSimple } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import "yet-another-react-lightbox/styles.css";

import Lightbox from "yet-another-react-lightbox";

interface AttachmentsProps {
  workspaceId: number;
  boardId: number;
  itemId: number;
  files: BoardItemFile[];
}

export const Attachments = ({
  files,
  workspaceId,
  boardId,
  itemId,
}: AttachmentsProps) => {
  const [attachmentIndex, setAttachmentIndex] = useState<number>(-1);

  const slides = useMemo(() => {
    return files.map(({ type, ...rest }) => ({
      ...rest,
      src: rest.url,
    }));
  }, [files]);

  return (
    <div className="mt-8">
      <p className="font-semibold">Attachments:</p>
      <div className="flex flex-col gap-4 mt-2">
        {(files || []).map((file, index) => (
          <div
            key={file.id}
            className="bg-accent/50 border-2 rounded p-2 flex gap-4 items-center"
          >
            <img
              className="w-16 h-16 cursor-pointer"
              src={file.url}
              onClick={() => {
                setAttachmentIndex(index);
              }}
            />
            <div className="flex flex-1">
              <div className="flex w-full flex-col gap-1">
                <p className="font-bold line-clamp-1">{file.name}</p>
                <p className="text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>

              <div className="flex w-32 items-center">
                <a
                  href={`http://localhost:8000/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/files/${file.id}`}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "gap-1 items-center",
                  })}
                >
                  <DownloadSimple weight="light" className="w-6 h-6" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        <Lightbox
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
          slides={slides}
          index={attachmentIndex}
          open={attachmentIndex > -1}
          close={() => setAttachmentIndex(-1)}
        />
      </div>
    </div>
  );
};
