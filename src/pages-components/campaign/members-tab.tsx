import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignMember } from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { IJoinRequest } from "@/src/features/join-requests/schemas/join-request.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

import { CampaignMembersSection } from "./sections/campaign-members";
import { CampaignJoinRequestsSection } from "./sections/campaign-join-requests";

interface MembersTabProps {
  campaign: ICampaign;
  canSeePrivateModules: boolean;
  characters: ICharacter[];
  isMaster: boolean;
  isUpdatingJoinRequest: boolean;
  members: ICampaignMember[];
  onOpenJoinRequest: (id: number) => void;
  onApproveJoinRequest: (id: number) => void;
  onRejectJoinRequest: (id: number) => void;
  onRemoveMember: (member: ICampaignMember) => void;
  pendingJoinRequests: IJoinRequest[];
}

export function MembersTab({
  campaign,
  canSeePrivateModules,
  characters,
  isMaster,
  isUpdatingJoinRequest,
  members,
  onOpenJoinRequest,
  onApproveJoinRequest,
  onRejectJoinRequest,
  onRemoveMember,
  pendingJoinRequests,
}: MembersTabProps) {
  return (
    <>
      {canSeePrivateModules ? (
        <CampaignMembersSection
          campaign={campaign}
          characters={characters}
          isMaster={isMaster}
          members={members}
          onRemoveMember={onRemoveMember}
        />
      ) : (
        <View style={styles.module}>
          <ThemedText style={styles.moduleTitle}>Acesso à mesa</ThemedText>
          <ThemedText style={styles.description}>
            Solicite entrada para visualizar membros.
          </ThemedText>
        </View>
      )}

      {isMaster && (
        <CampaignJoinRequestsSection
          isUpdatingJoinRequest={isUpdatingJoinRequest}
          onOpenJoinRequest={onOpenJoinRequest}
          onApproveJoinRequest={onApproveJoinRequest}
          onRejectJoinRequest={onRejectJoinRequest}
          pendingJoinRequests={pendingJoinRequests}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  module: {
    padding: 18,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  description: {
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    lineHeight: 22,
  },
});
