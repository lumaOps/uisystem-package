export type RecentPage = {
  id: string;
  userId: string;
  url: string;
  title: string;
  icon?: string;
  isPinned: boolean;
  lastVisited?: string | Date;
};

export type RecentPageInput = {
  userId: string;
  url: string;
  title: string;
  icon?: string;
  isPinned?: boolean;
  lastVisited?: number;
};

export type UpdateRecentPageInput = {
  id: string;
  isPinned?: boolean;
  lastVisited?: number;
};
