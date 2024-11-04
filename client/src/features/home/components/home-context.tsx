import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWorkspaces } from "@/features/user-workspaces/api/get-workspaces";
import { Workspace } from "@/types/entities";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface HomeContext {
  selectedWorkspaceId?: number;
  selectedWorkspace?: Workspace;
  setSelectedWorkspace: (workspace: Workspace) => void;
  isLoading: boolean;
  workspaces?: Workspace[];
}

const HomeContext = createContext<HomeContext | undefined>(undefined);

export const HomeContextProvder = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { workspaceId } = useParams();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();

  useEffect(() => {
    if (workspaces) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  useEffect(() => {
    if (workspaces && workspaceId) {
      setSelectedWorkspace(
        workspaces.find(({ id }) => id === Number(workspaceId))
      );
    }
  }, [workspaceId, workspaces]);

  if (
    workspaces &&
    workspaceId &&
    !workspaces.find(({ id }) => id === Number(workspaceId))
  ) {
    throw new Error("Workspace not found.");
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-dvh w-full items-center justify-center">
        <LoadingSpinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <HomeContext.Provider
      value={{
        selectedWorkspaceId: selectedWorkspace?.id,
        selectedWorkspace,
        setSelectedWorkspace,
        isLoading,
        workspaces,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const context = useContext(HomeContext);

  if (!context) {
    throw new Error(
      "useHomeContext must be used within the scope of HomeContextProvider."
    );
  }

  return context;
};
