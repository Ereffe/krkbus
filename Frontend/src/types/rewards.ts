export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  icon: string;
  category: "discount" | "ticket" | "merchandise" | "experience";
  validUntil?: string;
  quantity?: number; // For limited rewards
  image?: string;
}

export interface UserPoints {
  totalPoints: number;
  redeemedPoints: number;
  availablePoints: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  pointsHistory: PointsTransaction[];
}

export interface PointsTransaction {
  id: string;
  type: "earned" | "redeemed";
  amount: number;
  description: string;
  date: string;
  relatedRewardId?: string;
}
