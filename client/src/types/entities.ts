export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Status {
  id: string;
  name: string;
  position: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  token: string;
  inviteType: number;
  workspace: Workspace;
  inviteUrl: string;
  disabledAt: string;
  createdAt: string;
  updatedAt: string;
}
