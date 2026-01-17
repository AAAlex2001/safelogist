export type QuickAction = {
  text: string;
  buttonText: string;
};

export type RecentActionItem = {
  companyName: string;
  description: string;
  time: string;
  status: string;
};

export type FavouriteItem = {
  name: string;
  description: string;
  time: string;
};

export type Tip = {
  text: string;
};

export type DashBoardCardProps = {
  variant: "quick-actions" | "recent-actions" | "favourites" | "tips";
  title: string;
  actions?: QuickAction[];
  items?: RecentActionItem[] | FavouriteItem[];
  tips?: Tip[];
  showAllText?: string;
  onShowAll?: () => void;
};
