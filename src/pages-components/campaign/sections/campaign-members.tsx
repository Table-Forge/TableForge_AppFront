import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CharacterItem } from "@/src/components/character-item/character-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignMember } from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface CampaignMembersSectionProps {
  campaign: ICampaign;
  characters: ICharacter[];
  isMaster: boolean;
  members: ICampaignMember[];
  onRemoveMember: (member: ICampaignMember) => void;
}

export function CampaignMembersSection({
  campaign,
  characters,
  isMaster,
  members,
  onRemoveMember,
}: CampaignMembersSectionProps) {
  const players = members.filter((m) => m.role !== "Master");

  return (
    <View style={styles.module}>
      <View style={styles.membersHeader}>
        <ThemedText style={[styles.moduleTitle, styles.moduleTitleNoMargin]}>
          Membros
        </ThemedText>
        <ThemedText style={styles.memberCounter}>
          {players.length}/{campaign.playersLimit}
        </ThemedText>
      </View>
      {players.length ? (
        isMaster ? (
          <View style={styles.membersVerticalContainer}>
            {players.map((member) => (
              <CharacterItem
                key={member.id}
                data={getMemberCharacter(member, characters)}
                cardColor={DEFAULT_COLORS.cardImageDark}
                disabled={!member.characterId}
                showOwner
                onRemove={() => onRemoveMember(member)}
              />
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.membersScrollContainer}
          >
            {players.map((member) => (
              <CharacterItem
                key={member.id}
                data={getMemberCharacter(member, characters)}
                cardColor={DEFAULT_COLORS.cardImageDark}
                disabled={!member.characterId}
                showOwner
              />
            ))}
          </ScrollView>
        )
      ) : (
        <EmptyText text="Nenhum jogador listado." />
      )}
    </View>
  );
}

const EmptyText = ({ text }: { text: string }) => (
  <ThemedText style={styles.emptyText}>{text}</ThemedText>
);

function getMemberCharacter(
  member: ICampaignMember,
  characters: ICharacter[],
): ICharacter {
  const character = characters.find((item) => item.id === member.characterId);

  if (character) return character;

  return {
    id: member.characterId ?? member.userId,
    name: member.username || "Membro",
    classId: 0,
    className: member.role === "Master" ? "Mestre" : "Jogador",
    raceId: 0,
    raceName: "Membro da mesa",
    userId: member.userId,
    userUsername: member.username,
  };
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
  moduleTitleNoMargin: {
    marginBottom: 0,
    flex: 1,
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memberCounter: {
    color: DEFAULT_COLORS.textMuted,
    fontSize: 13,
    ...fonts.bold,
  },
  membersScrollContainer: {
    gap: 12,
    paddingRight: 20,
  },
  membersVerticalContainer: {
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
});
