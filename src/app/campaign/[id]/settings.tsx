import React, { useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Screen } from "@/src/components/screen/screen";
import { ModalConfirmation } from "@/src/components/modals/modal-confirmation/modal-confirmation";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCampaignBlockedClasses } from "@/src/features/campaign-blocked-classes/hooks/use-campaign-blocked-classes";
import { useCampaignBlockedRaces } from "@/src/features/campaign-blocked-races/hooks/use-campaign-blocked-races";
import { Toggle } from "@/src/components/toggle/toggle";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
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
  const [toggleConfirmation, setToggleConfirmation] =
    useState<ToggleConfirmation | null>(null);

  const blockedClassNames = useMemo(() => {
    return blockedClasses
      .map((item) => item.className || `Classe ${item.classId}`)
      .join(", ");
  }, [blockedClasses]);

  const blockedRaceNames = useMemo(() => {
    return blockedRaces
      .map((item) => item.raceName || `Raça ${item.raceId}`)
      .join(", ");
  }, [blockedRaces]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { deleteCampaignMutation, isDeletingCampaign } = useCampaignsMutation();

  const handleToggleConfirm = () => {
    if (!campaign || !toggleConfirmation) return;

    updateCampaignMutation.mutate({
      ...campaign,
      [toggleConfirmation.field]: toggleConfirmation.nextValue,
    });
    setToggleConfirmation(null);
  };

  const handleDeleteCampaignConfirm = async () => {
    if (!campaign) return;
    try {
      await deleteCampaignMutation.mutateAsync(campaign.id);
      setIsDeleteModalVisible(false);
      router.replace("/(tabs)/");
    } catch {
      // handled by mutation
    }
  };

  if (isLoading || !campaign) return <ThemedText>Carregando...</ThemedText>;

  return (
    <Screen style={styles.container}>
      <Screen.Header>
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
      </Screen.Header>

      <Screen.Body scroll contentContainerStyle={styles.content}>
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
              style={styles.editIcon}
            >
              <FontAwesome5
                name="pen"
                size={12}
                color={DEFAULT_COLORS.purpleBright}
              />
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

        <View style={[styles.module, { borderColor: "#ef4444" }]}>
          <View style={styles.moduleHeader}>
            <ThemedText style={[styles.moduleTitle, { color: "#ef4444" }]}>
              Zona de Perigo
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={20} color={DEFAULT_COLORS.white} />
            <ThemedText style={styles.deleteButtonText}>
              Excluir Campanha
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Screen.Body>

      <ModalConfirmation
        visible={!!toggleConfirmation}
        title={toggleConfirmation?.title ?? ""}
        description={toggleConfirmation?.description}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onClose={() => setToggleConfirmation(null)}
        onConfirm={handleToggleConfirm}
      />

      <ModalConfirmation
        visible={isDeleteModalVisible}
        title="Excluir Campanha"
        description="Tem certeza que deseja excluir esta campanha? Esta ação NÃO PODE SER DESFEITA e todos os jogadores serão notificados."
        confirmText="Excluir"
        cancelText="Cancelar"
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteCampaignConfirm}
        isLoading={isDeletingCampaign}
      />
    </Screen>
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
        <TouchableOpacity onPress={onEdit} style={styles.editIcon}>
          <FontAwesome5
            name="pen"
            size={11}
            color={DEFAULT_COLORS.purpleBright}
          />
        </TouchableOpacity>
      )}
    </View>
    <ThemedText style={styles.settingValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SURFACES.background },
  headerTitle: { fontSize: 20, color: DEFAULT_COLORS.white },
  content: { padding: 20, gap: 18, paddingBottom: 60 },
  module: {
    padding: 18,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    gap: 14,
    ...SHADOWS.soft,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moduleTitle: {
    fontSize: 11,
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  settingItem: { gap: 4 },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 12,
    color: DEFAULT_COLORS.textMuted,
    letterSpacing: 0.4,
  },
  settingValue: { fontSize: 15, color: DEFAULT_COLORS.white },
  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editIcon: {
    width: 28,
    height: 28,
    borderRadius: RADII.pill,
    backgroundColor: SURFACES.fill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: RADII.md,
  },
  deleteButtonText: {
    color: DEFAULT_COLORS.white,
    fontSize: 14,
    ...fonts.bold,
  },
});
