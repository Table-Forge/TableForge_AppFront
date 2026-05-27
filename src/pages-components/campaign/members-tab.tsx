import { Pressable, StyleSheet, View, ScrollView } from "react-native";

import { Button } from "@/src/components/button/button";
import { CharacterItem } from "@/src/components/character-item/character-item";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { ICampaignMember } from "@/src/features/campaign-members/schemas/campaign-member.schema";
import { ICampaign } from "@/src/features/campaigns/schemas/campaign.schema";
import { ICharacter } from "@/src/features/characters/schemas/character.schema";
import { IJoinRequest } from "@/src/features/join-requests/schemas/join-request.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";

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
  pendingJoinRequests,
}: MembersTabProps) {
  return (
    <>
      {canSeePrivateModules ? (
        <View style={styles.module}>
          <View style={styles.membersHeader}>
            <ThemedText
              style={[styles.moduleTitle, styles.moduleTitleNoMargin]}
            >
              Membros
            </ThemedText>
            <ThemedText style={styles.memberCounter}>
              {members.length}/{campaign.playersLimit}
            </ThemedText>
          </View>
          {members.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membersScrollContainer}
            >
              {members.map((member) => (
                <CharacterItem
                  key={member.id}
                  data={getMemberCharacter(member, characters)}
                  cardColor={DEFAULT_COLORS.background}
                  disabled={!member.characterId}
                />
              ))}
            </ScrollView>
          ) : (
            <EmptyText text="Nenhum membro listado." />
          )}
        </View>
      ) : (
        <View style={styles.module}>
          <ThemedText style={styles.moduleTitle}>Acesso à mesa</ThemedText>
          <ThemedText style={styles.description}>
            Solicite entrada para visualizar membros.
          </ThemedText>
        </View>
      )}

      {isMaster && (
        <View style={styles.module}>
          <ThemedText style={styles.moduleTitle}>
            Solicitações de entrada
          </ThemedText>
          {pendingJoinRequests.length ? (
            pendingJoinRequests.map((request) => (
              <Pressable
                key={request.id}
                style={({ pressed }) => [
                  styles.requestItem,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => onOpenJoinRequest(request.id)}
              >
                <InlineItem
                  title={request.username || `Usuário ${request.userId}`}
                  description={request.message || "Sem mensagem."}
                />
                <View style={styles.requestActions}>
                  <Button
                    size="sm"
                    variant="secondary"
                    text="Rejeitar"
                    isLoading={isUpdatingJoinRequest}
                    onPress={() => onRejectJoinRequest(request.id)}
                  />
                  <Button
                    size="sm"
                    variant="tertiary"
                    text="Aprovar"
                    isLoading={isUpdatingJoinRequest}
                    onPress={() => onApproveJoinRequest(request.id)}
                  />
                </View>
              </Pressable>
            ))
          ) : (
            <EmptyText text="Nenhuma solicitação pendente." />
          )}
        </View>
      )}
    </>
  );
}

const InlineItem = ({
  title,
  description,
}: {
  title: string;
  description?: string | null;
}) => (
  <View style={styles.inlineItem}>
    <ThemedText weight="bold" style={styles.inlineTitle}>
      {title}
    </ThemedText>
    {!!description && (
      <ThemedText style={styles.inlineDescription} numberOfLines={2}>
        {description}
      </ThemedText>
    )}
  </View>
);

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
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.1)",
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  moduleTitleNoMargin: {
    marginBottom: 0,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 22,
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memberCounter: {
    color: DEFAULT_COLORS.grays._200,
    fontSize: 13,
  },
  membersScrollContainer: {
    gap: 12,
    paddingRight: 20,
  },
  inlineItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  inlineTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  inlineDescription: {
    marginTop: 3,
    fontSize: 13,
    color: "rgba(255,255,255,0.58)",
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
  },
  requestItem: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
});
