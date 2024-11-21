import { HomeLayout } from "@/components/layout/home-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { HomeContextProvder } from "@/features/home/components/home-context";
import { UpdatePasswordForm } from "./update-password-form";
import { UpdateProfileForm } from "./update-profile-form";
import { UpdateProfilePicture } from "./update-profile-picture";

export const AccountSettings = () => {
  const { data: user, isLoading: isUserLoading } = useAuthUser();

  if (isUserLoading) {
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <HomeContextProvder>
      <HomeLayout>
        <div className="max-w-3xl w-full mx-auto my-8 space-y-16 px-4">
          <div>
            <h1 className="text-xl font-semibold">Update Profile</h1>
            <div className="flex gap-4">
              <UpdateProfileForm user={user!} />
              <UpdateProfilePicture user={user!} />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold">Update Password</h1>
            <UpdatePasswordForm />
          </div>
        </div>
      </HomeLayout>
    </HomeContextProvder>
  );
};
