import { DEFAULT_COLORS } from "@/src/theme/colors";
import { CampaignItemList } from "./campaign-item.list";
import { CampaignItemTinder } from "./campaign-item.tinder";
import { ICampaignItemProps } from "./campaign-item.types";

export const CampaignItem = ({
  data,
  cardColor = DEFAULT_COLORS.primary,
  tagColor = DEFAULT_COLORS.tertiary_30,
  variant = "list",
}: ICampaignItemProps) => {
  if (variant === "tinder") {
    return (
      <CampaignItemTinder
        data={data}
        cardColor={cardColor}
        tagColor={tagColor}
      />
    );
  }

  return (
    <CampaignItemList data={data} cardColor={cardColor} tagColor={tagColor} />
  );
};
