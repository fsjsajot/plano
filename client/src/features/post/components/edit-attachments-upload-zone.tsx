import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import { FormControl, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { X } from "@phosphor-icons/react";
import { BoardItemFile } from "@/types/entities";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
interface UploadedFile extends File {
  id: string;
  preview: string;
}

export const EditAttachmentsDropzone = ({
  onChange,
  handleItemFileDelete,
  isDeleting,
  itemFiles,
  deletedFileId
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleItemFileDelete: (fileId: number) => void;
  isDeleting: boolean;
  itemFiles: BoardItemFile[];
  deletedFileId?: number;
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { getRootProps, getInputProps, inputRef } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            id: window.crypto.randomUUID(),
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const removeLocalFile = (file: UploadedFile) => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const updatedFiles = files.filter(({ id }) => id !== file.id);
    URL.revokeObjectURL(file.preview);
    setFiles(updatedFiles);
  };

  return (
    <FormItem>
      <FormItem>Attachments</FormItem>

      <FormControl>
        <div className="border p-4">
          <section className="flex flex-col">
            <div
              {...getRootProps()}
              className="flex flex-1 flex-col items-center border-dashed border-2 p-5 outline-none"
            >
              <input {...getInputProps({ onChange })} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {itemFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent/50 border-2 rounded p-2 flex gap-4 items-center"
                >
                  <img className="w-16 h-16" src={file.url} />
                  <div className="flex flex-1">
                    <div className="flex w-full flex-col gap-1">
                      <p className="font-bold line-clamp-1">{file.name}</p>
                      <p className="text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <div className="flex gap-2 px-2 justify-end">
                      <div className="flex items-center">
                        <Button
                          disabled={deletedFileId === file.id && isDeleting}
                          type="button"
                          onClick={() => handleItemFileDelete(file.id)}
                          variant="destructive"
                          size="sm"
                        >
                          {deletedFileId === file.id && isDeleting ? (
                            <span className="inline-flex items-center gap-1">
                              <LoadingSpinner />
                              Deleting...
                            </span>
                          ) : (
                            <>
                              <X weight="light" />
                              <span>Remove</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="bg-accent/50 border-2 rounded p-2 flex gap-4 items-center"
                >
                  <img className="w-16 h-16" src={file.preview} />
                  <div className="flex flex-1">
                    <div className="flex w-full flex-col gap-1">
                      <p className="font-bold line-clamp-1">{file.name}</p>
                      <p className="text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <div className="flex gap-2 px-2 justify-end">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          onClick={() => removeLocalFile(file)}
                          variant="destructive"
                          size="sm"
                        >
                          <X weight="light" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </FormControl>
    </FormItem>
  );
};
