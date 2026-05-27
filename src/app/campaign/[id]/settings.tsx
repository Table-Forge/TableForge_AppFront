import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ModalConfirmation } from "@/src/components/modals/modal-confirmation/modal-confirmation";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCampaignBlockedClasses } from "@/src/features/campaign-blocked-classes/hooks/use-campaign-blocked-classes";
import { useCampaignBlockedRaces } from "@/src/features/campaign-blocked-races/hooks/use-campaign-blocked-races";
import { Toggle } from "@/src/components/toggle/toggle";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { useClassesSelect } from "@/src/features/classes/hooks/use-classes-select";
import { useRacesSelect } from "@/src/features/races/hooks/use-races-select";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useBackRouter } from "@/src/hooks/use-back-route";

type ToggleConfirmation = {
  field: "isChatEnabled" | "isPrivate";
  nextValue: boolean;
  title: string;
  description: string;
};

export default function CampaignSettings() {
  const { handleBack } = useBackRouter();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const campaignId = Number(id);
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const { updateCampaignMutation, isUpdatingCampaign } = useCampaignsMutation();
  const { data: blockedClasses = [] } = useCampaignBlockedClasses({
    campaignId,
  });
  const { data: blockedRaces = [] } = useCampaignBlockedRaces({
    campaignId,
  });
  const { classOptions } = useClassesSelect({ enabled: !!campaign });
  const { raceOptions } = useRacesSelect({ enabled: !!campaign });
  const [toggleConfirmation, setToggleConfirmation] =
    useState<ToggleConfirmation | null>(null);

  const blockedClassNames = useMemo(() => {
    const blockedClassIds = blockedClasses.map((item) => item.classId);

    return classOptions
      .filter((option) => blockedClassIds.includes(Number(option.value)))
      .map((option) => option.name)
      .join(", ");
  }, [blockedClasses, classOptions]);

  const blockedRaceNames = useMemo(() => {
    const blockedRaceIds = blockedRaces.map((item) => item.raceId);

    return raceOptions
      .filter((option) => blockedRaceIds.includes(Number(option.value)))
      .map((option) => option.name)
      .join(", ");
  }, [blockedRaces, raceOptions]);

  const handleToggleConfirm = () => {
    if (!campaign || !toggleConfirmation) return;

    updateCampaignMutation.mutate({
      ...campaign,
      [toggleConfirmation.field]: toggleConfirmation.nextValue,
    });
    setToggleConfirmation(null);
  };

  if (isLoading || !campaign) return <ThemedText>Carregando...</ThemedText>;

  return (
    <MainContainer style={styles.container}>
      <HeaderActions>
        <ActionButton
          variant="circle"
          icon={
            <Ionicons
              name="arrow-back"
              size={22}
              color={DEFAULT_COLORS.white}
            />
          }
          onPress={handleBack}
        />
        <ThemedText weight="bold" style={styles.headerTitle}>
          Configurações
        </ThemedText>
        <View style={{ width: 45 }} />
      </HeaderActions>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.module}>
          <View style={styles.moduleHeader}>
            <ThemedText style={styles.moduleTitle}>
              Dados da campanha
            </ThemedText>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/campaign/create",
                  params: { id: campaign.id.toString() },
                })
              }
            >
              <FontAwesome5 name="pen" size={14} color={DEFAULT_COLORS.white} />
            </TouchableOpacity>
          </View>

          <SettingItem label="Nome da Campanha" value={campaign.title} />
          <SettingItem
            label="Local"
            value={campaign.locationName || campaign.address || "Online"}
          />
          <SettingItem label="Sistema" value={campaign.gameSystemName || "-"} />
          <SettingItem label="Dificuldade" value={campaign.difficulty || "-"} />
          <SettingItem label="Sinopse" value={campaign.description || "-"} />
        </View>

        <View style={styles.module}>
          <View style={styles.moduleHeader}>
            <ThemedText style={styles.moduleTitle}>
              Preferências da campanha
            </ThemedText>
          </View>

          <SettingItem
            label="Classes bloqueadas"
            value={blockedClassNames || "Nenhuma"}
            onEdit={() =>
              router.push({
                pathname: "/campaign/[id]/blocked-options",
                params: { id: campaign.id.toString(), type: "classes" },
              })
            }
          />
          <SettingItem
            label="Raças bloqueadas"
            value={blockedRaceNames || "Nenhuma"}
            onEdit={() =>
              router.push({
                pathname: "/campaign/[id]/blocked-options",
                params: { id: campaign.id.toString(), type: "races" },
              })
            }
          />
          <SettingItem
            label="Máximo de Jogadores"
            value={`${campaign.playersLimit || 5}`}
          />

          <View style={styles.switchItem}>
            <ThemedText style={styles.settingLabel}>Chat habilitado</ThemedText>
            <Toggle
              value={!!campaign.isChatEnabled}
              disabled={isUpdatingCampaign}
              onValueChange={(nextValue) => {
                setToggleConfirmation({
                  field: "isChatEnabled",
                  nextValue,
                  title: `${nextValue ? "Habilitar" : "Desabilitar"} chat da campanha?`,
                  description: nextValue
                    ? "O chat ficará disponível para os participantes."
                    : "O chat deixará de aparecer para os participantes.",
                });
              }}
            />
          </View>

          <View style={styles.switchItem}>
            <ThemedText style={styles.settingLabel}>Mesa privada</ThemedText>
            <Toggle
              value={campaign.isPrivate}
              disabled={isUpdatingCampaign}
              onValueChange={(nextValue) => {
                setToggleConfirmation({
                  field: "isPrivate",
                  nextValue,
                  title: `${nextValue ? "Tornar" : "Remover"} mesa privada?`,
                  description: nextValue
                    ? "A campanha ficará fora das buscas públicas."
                    : "A campanha voltará a aparecer nas buscas públicas.",
                });
              }}
            />
          </View>
        </View>
      </ScrollView>

      <ModalConfirmation
        visible={!!toggleConfirmation}
        title={toggleConfirmation?.title ?? ""}
        description={toggleConfirmation?.description}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onClose={() => setToggleConfirmation(null)}
        onConfirm={handleToggleConfirm}
      />
    </MainContainer>
  );
}

const SettingItem = ({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingHeader}>
      <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <FontAwesome5 name="pen" size={12} color={DEFAULT_COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
    <ThemedText style={styles.settingValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, color: DEFAULT_COLORS.white },
  content: { padding: 20, gap: 20, paddingBottom: 60 },
  module: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.1)",
    gap: 16,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moduleTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  settingItem: { gap: 4 },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  settingValue: { fontSize: 15, color: DEFAULT_COLORS.white },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
