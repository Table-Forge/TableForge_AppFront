export type TImageType = "CampaignBanner" | "UserProfile" | "GameSystem" | "ChatAttachment" | "CharacterAvatar";

export type IImageFile = {
  uri: string;
  name: string;
  type: string;
};

export type IImage = {
  id?: number;
  userId?: number;
  campaignId?: number;
  uuid?: string;
  type: TImageType;
  name: string;
  file: IImageFile;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  url?: string;
};

export type ICreateImageResponse =
  | number
  | string
  | {
      id?: unknown;
      url?: string;
    };
