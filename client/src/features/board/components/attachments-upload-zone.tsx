import { X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { formatFileSize } from "@/lib/utils";

export const AttachmentDropzone = ({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

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

            <div className="flex flex-col mt-4">
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

                    <div className="flex w-32 items-center">
                      <Button variant="destructive" size="sm">
                        <X weight="light" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside> */}
          </section>
        </div>
      </FormControl>
    </FormItem>
  );
};
