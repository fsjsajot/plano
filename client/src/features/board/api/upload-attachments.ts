import { http } from "@/lib/http";

export interface Attachment extends File {
  preview: string;
}

export const uploadAttachments = async ({
  workspaceId,
  boardId,
  itemId,
  files,
}: {
  workspaceId: number;
  boardId: number;
  itemId: number;
  files: FileList;
}) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files[]", file);
  }

  const response = await http.post(
    `/api/workspaces/${workspaceId}/boards/${boardId}/items/${itemId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

