import React from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Button } from "@/src/components/button/button";
import { campaignList } from "@/src/data/mock";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ActionButton } from "@/src/components/action-button/action-button";
import { Ionicons } from "@expo/vector-icons";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { HeaderActions } from "@/src/components/header-actions/header-actions";

const { width } = Dimensions.get("window");

export default function CampaignDetails() {
  const { handleBack } = useBackRouter();

  const { id } = useLocalSearchParams();
  const campaign =
    campaignList.find((c) => c.id === Number(id)) || campaignList[0];

  const availableSlots = campaign.maxPartySize - campaign.currentPartySize;

  return (
    <MainContainer style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground source={{ uri: campaign.image }} style={styles.banner}>
          <HeaderActions padding={10}>
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
          </HeaderActions>

          <View style={styles.titleOverlay}>
            <ThemedText weight="bold" style={styles.title}>
              {campaign.title}
            </ThemedText>
            <ThemedText style={styles.masterText}>
              Mestre: {campaign.gameMaster}
            </ThemedText>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.module}>
            <ThemedText style={styles.moduleTitle}>MISSÃO</ThemedText>
            <ThemedText style={styles.description}>
              {campaign.fullDescription}
            </ThemedText>
          </View>

          <View style={styles.module}>
            <ThemedText style={styles.moduleTitle}>
              DETALHES DA PARTY
            </ThemedText>
            <View style={styles.row}>
              <InfoItem
                icon="sword-cross"
                label="Sistema"
                value={campaign.system}
              />
              <InfoItem
                icon="shield-star"
                label="Nível"
                value={campaign.level}
              />
            </View>
            <View style={[styles.row, { marginTop: 15 }]}>
              <InfoItem
                icon="map-marker"
                label="Local"
                value={campaign.location}
              />
              <InfoItem
                icon="account-group"
                label="Vagas"
                value={`${availableSlots} livres`}
              />
            </View>
          </View>

          <View style={styles.module}>
            <ThemedText style={styles.moduleTitle}>
              AGENDA DE SESSÕES
            </ThemedText>
            <ThemedText style={styles.description}>
              Frequência:{" "}
              <ThemedText weight="bold" style={{ color: DEFAULT_COLORS.white }}>
                {campaign.frequency}
              </ThemedText>
            </ThemedText>
            <ThemedText style={styles.description}>
              Próximo Encontro:{" "}
              <ThemedText
                weight="bold"
                style={{ color: DEFAULT_COLORS.tertiary }}
              >
                {campaign.nextSession?.day} às {campaign.nextSession?.time}
              </ThemedText>
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="tertiary"
          text={
            availableSlots > 0 ? "SOLICITAR ENTRADA NA MESA" : "MESA LOTADA"
          }
          disabled={availableSlots === 0}
          onPress={() => {}}
        />
      </View>
    </MainContainer>
  );
}

const InfoItem = ({ icon, label, value }: any) => (
  <View style={{ flex: 1, gap: 4 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={DEFAULT_COLORS.secondary}
      />
      <ThemedText
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </ThemedText>
    </View>
    <ThemedText weight="bold" style={{ fontSize: 14 }}>
      {value}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    width: "100%",
    height: width * 0.7,
    justifyContent: "space-between",
  },
  titleOverlay: {
    padding: 20,
    backgroundColor: "rgba(26, 26, 46, 0.85)",
    borderTopWidth: 2,
    borderTopColor: DEFAULT_COLORS.tertiary,
  },
  title: {
    fontSize: 26,
    color: DEFAULT_COLORS.white,
    textShadowColor: "black",
    textShadowRadius: 10,
  },
  masterText: { fontSize: 14, color: DEFAULT_COLORS.grays._200, marginTop: 4 },
  content: { padding: 20, gap: 20 },
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
  },
  description: { fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 22 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: DEFAULT_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
});
