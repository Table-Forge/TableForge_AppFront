import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";

export interface ICampaignItemProps {
  data: ICampaign;
  cardColor?: string;
  tagColor?: string;
  variant?: "list" | "tinder";
}
