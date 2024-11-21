import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types/entities";
import { ChangeEvent, useRef } from "react";
import { useUpdateUserAvatar } from "../api/upload-avatar";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const UpdateProfilePicture = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadAvatar, isPending } = useUpdateUserAvatar({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Updated user avatar.");
        queryClient.invalidateQueries({
          queryKey: ["me"],
        });
      },

      onError: (error) => {
        if (axios.isAxiosError(error)) {
          return toast.error(error.response?.data.message);
        }

        console.error(error);
        throw error;
      },
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      toast.info("Uploading logo...");

      uploadAvatar(formData);
    }
  };

  return (
    <div className="flex flex-1 justify-center items-center flex-col gap-4">
      <h1 className="text-lg font-semibold">Update Profile Picture</h1>

      <Avatar className="h-40 w-40 rounded-md">
        <AvatarImage src={user.avatarUrl} alt="user avatar" />
        <AvatarFallback className="text-6xl rounded-full">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <input
        accept="image/*"
        ref={inputFileRef}
        type="file"
        name="logo"
        onChange={handleChange}
        id="logo"
        className="hidden"
      />
      <Button
        disabled={isPending}
        onClick={() => {
          if (inputFileRef.current) {
            inputFileRef.current.value = "";
            inputFileRef.current.click();
          }
        }}
        variant="secondary"
        size="sm"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-1">
            <LoadingSpinner />
            Saving...
          </span>
        ) : (
          "Change Profile Picture"
        )}
      </Button>
    </div>
  );
};
