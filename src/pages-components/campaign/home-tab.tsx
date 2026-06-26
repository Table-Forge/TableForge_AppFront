import React from "react";
import { ICampaignAnnouncement } from "@/src/features/campaign-announcements/schemas/campaign-announcement.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { TOptions } from "@/src/interfaces";

import { CampaignDescriptionSection } from "./sections/campaign-description";
import { CampaignDetailsSection } from "./sections/campaign-details";
import { CampaignAnnouncementsSection } from "./sections/campaign-announcements";

interface HomeTabProps {
  announcements: ICampaignAnnouncement[];
  campaign: ICampaign;
  canSeePrivateModules: boolean;
  difficultyLevelEnum: TOptions[];
  isMaster: boolean;
  onCreateAnnouncement: () => void;
  onEditAnnouncement?: (announcement: ICampaignAnnouncement) => void;
  onDeleteAnnouncement: (announcement: ICampaignAnnouncement) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export function HomeTab({
  announcements,
  campaign,
  canSeePrivateModules,
  difficultyLevelEnum,
  isMaster,
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}: HomeTabProps) {
  return (
    <>
      <CampaignDescriptionSection campaign={campaign} />

      <CampaignDetailsSection 
        campaign={campaign} 
        difficultyLevelEnum={difficultyLevelEnum} 
      />

      {canSeePrivateModules && (
        <CampaignAnnouncementsSection
          announcements={announcements}
          isMaster={isMaster}
          onCreateAnnouncement={onCreateAnnouncement}
          onEditAnnouncement={onEditAnnouncement}
          onDeleteAnnouncement={onDeleteAnnouncement}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={onFetchNextPage}
        />
      )}
    </>
  );
}
