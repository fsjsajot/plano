export interface PaginatedResponse {
  links: {
    next: string | null;
    first: string | null;
    prev: string | null;
    last: string | null;
  };

  meta: {
    nextCursor: string | null;
    prevCursor: string | null;
    perPage: number;
    path: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerifiedAt: string;
  workspaces: Workspace[];
  avatarUrl: string;
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
  items: BoardItem[];
}

export interface Status {
  id: number;
  name: string;
  position: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  items?: BoardItem[];
  workspaceId: number;
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
  votes: ItemVote[];
  status?: Status;
  voteCount: number;
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
  children: ItemComment[];
}

export interface ItemVote {
  id: number;
  userId: number;
  boardItemId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBoardItem extends PaginatedResponse {
  data: BoardItem[];
}
