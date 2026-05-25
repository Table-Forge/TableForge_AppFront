import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCampaign } from "@/src/features/campaigns/hooks/use-campaign";
import { useCampaignsMutation } from "@/src/features/campaigns/hooks/use-campaigns-mutations";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { useBackRouter } from "@/src/hooks/use-back-route";

export default function CampaignSettings() {
  const { handleBack } = useBackRouter();
  const { id } = useLocalSearchParams();
  const campaignId = Number(id);
  const { data: campaign, isLoading } = useCampaign(campaignId);
  const { updateCampaignMutation, isUpdatingCampaign } = useCampaignsMutation();

  const handleToggleChat = () => {
    if (campaign) {
      updateCampaignMutation.mutate({
        id: campaign.id,
        isChatEnabled: !campaign.isChatEnabled,
      });
    }
  };

  const handleTogglePrivate = () => {
    if (campaign) {
      updateCampaignMutation.mutate({
        id: campaign.id,
        isPrivate: !campaign.isPrivate,
      });
    }
  };

  if (isLoading || !campaign) return <ThemedText>Carregando...</ThemedText>;

  return (
    <MainContainer style={styles.container}>
      <HeaderActions padding={20}>
        <ActionButton
          variant="circle"
          icon={<Ionicons name="arrow-back" size={22} color={DEFAULT_COLORS.white} />}
          onPress={handleBack}
        />
        <ThemedText weight="bold" style={styles.headerTitle}>Configurações</ThemedText>
        <ActionButton
          variant="circle"
          icon={<Ionicons name="settings-sharp" size={22} color={DEFAULT_COLORS.white} />}
          onPress={() => {}}
        />
      </HeaderActions>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.module}>
          <View style={styles.moduleHeader}>
            <ThemedText style={styles.moduleTitle}>DADOS DA CAMPANHA</ThemedText>
            <TouchableOpacity>
              <FontAwesome5 name="pen" size={14} color={DEFAULT_COLORS.white} />
            </TouchableOpacity>
          </View>

          <SettingItem label="Nome da Campanha" value={campaign.title} />
          <SettingItem label="Local" value={campaign.locationName || campaign.address || "Online"} />
          <SettingItem label="Sistema" value={campaign.gameSystemName || "-"} />
          <SettingItem label="Dificuldade" value={campaign.difficulty || "-"} />
          <SettingItem label="Sinopse" value={campaign.description || "-"} />
        </View>

        <View style={styles.module}>
          <View style={styles.moduleHeader}>
            <ThemedText style={styles.moduleTitle}>PREFERÊNCIAS DA CAMPANHA</ThemedText>
            <TouchableOpacity>
              <FontAwesome5 name="pen" size={14} color={DEFAULT_COLORS.white} />
            </TouchableOpacity>
          </View>

          <SettingItem label="Classes e Raças bloqueadas" value="Nenhuma" />
          <SettingItem label="Máximo de Jogadores" value={`${campaign.playersLimit || 5}`} />
          
          <View style={styles.switchItem}>
             <ThemedText style={styles.settingLabel}>Chat habilitado?</ThemedText>
             <Switch 
                value={campaign.isChatEnabled} 
                onValueChange={handleToggleChat} 
                disabled={isUpdatingCampaign}
                thumbColor={campaign.isChatEnabled ? DEFAULT_COLORS.primary : DEFAULT_COLORS.grays._300}
                trackColor={{ false: DEFAULT_COLORS.grays._500, true: DEFAULT_COLORS.tertiary }}
             />
          </View>

          <View style={styles.switchItem}>
             <ThemedText style={styles.settingLabel}>Mesa privada?</ThemedText>
             <Switch 
                value={campaign.isPrivate} 
                onValueChange={handleTogglePrivate} 
                disabled={isUpdatingCampaign}
                thumbColor={campaign.isPrivate ? DEFAULT_COLORS.primary : DEFAULT_COLORS.grays._300}
                trackColor={{ false: DEFAULT_COLORS.grays._500, true: DEFAULT_COLORS.tertiary }}
             />
          </View>

        </View>

      </ScrollView>
    </MainContainer>
  );
}

const SettingItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.settingItem}>
    <ThemedText style={styles.settingLabel}>{label}</ThemedText>
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
    gap: 16
  },
  moduleHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  moduleTitle: { fontSize: 12, color: DEFAULT_COLORS.tertiary, letterSpacing: 1 },
  settingItem: { gap: 4 },
  settingLabel: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  settingValue: { fontSize: 15, color: DEFAULT_COLORS.white },
  switchItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
});
