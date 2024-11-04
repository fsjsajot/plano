export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string;
  workspaces: Workspace[];
}

export interface Workspace {
  id: number;
  name: string;
  description: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  logoUrl: string;
}

export interface Board {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items: BoardItem[]
}

export interface Status {
  id: number;
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

export interface BoardItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  boardId: number;
  statusId: number;
}

export interface BoardItemFile {
  id: number;
  name: string;
  url: string;
  size: number;
  width: number;
  height: number;
  type: string;
  boardItemId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemComment {
  id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  boardItemId: number;
  parentId: number;
  depth: number;
  children: ItemComment[]
}