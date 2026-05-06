export type TImageType = "CampaignBanner" | "UserProfile" | "GameSystem";

export type IImage = {
  id?: number;
  userId?: number;
  campaignId?: number;
  uuid?: string;
  type: TImageType;
  name: string;
  content: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  url?: string;
};

export type ICreateImageResponse =
  | number
  | string
  | {
      id?: unknown;
    };
