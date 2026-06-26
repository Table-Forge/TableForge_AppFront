import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Button } from "@/src/components/button/button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { IJoinRequest } from "@/src/features/join-requests/schemas/join-request.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface CampaignJoinRequestsSectionProps {
  isUpdatingJoinRequest: boolean;
  onOpenJoinRequest: (id: number) => void;
  onApproveJoinRequest: (id: number) => void;
  onRejectJoinRequest: (id: number) => void;
  pendingJoinRequests: IJoinRequest[];
}

export function CampaignJoinRequestsSection({
  isUpdatingJoinRequest,
  onOpenJoinRequest,
  onApproveJoinRequest,
  onRejectJoinRequest,
  pendingJoinRequests,
}: CampaignJoinRequestsSectionProps) {
  return (
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
                variant="primary"
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
  inlineItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS.divider,
  },
  inlineTitle: {
    fontSize: 14,
    color: DEFAULT_COLORS.white,
  },
  inlineDescription: {
    marginTop: 3,
    fontSize: 13,
    color: DEFAULT_COLORS.white_64,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.textMuted,
  },
  requestItem: {
    borderTopWidth: 1,
    borderTopColor: BORDERS.divider,
    paddingTop: 4,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
});
