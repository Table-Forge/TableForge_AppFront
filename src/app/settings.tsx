import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import React, { useState } from "react";
import { useAuth } from "@/src/context/auth";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { Screen } from "@/src/components/screen/screen";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const { handleBack } = useBackRouter();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [isLogoutOpen, setLogoutOpen] = useState(false);

  const handleSignOut = async () => {
    setLogoutOpen(false);
    signOut();
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconCircle}>{icon}</View>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      </View>
      <View style={styles.settingItemRight}>
        {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={DEFAULT_COLORS.white_35}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Screen style={styles.safe}>
        <Screen.Header>
          <HeaderActions>
            <ActionButton
              variant="circle"
              icon={
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={DEFAULT_COLORS.white}
                />
              }
              onPress={handleBack}
            />
            <ThemedText style={styles.headerTitle}>Configurações</ThemedText>
            <View style={{ width: 45 }} />
          </HeaderActions>
        </Screen.Header>

        <Screen.Body scroll showsVerticalScrollIndicator={false}>
          <View style={styles.contentBody}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Conta</ThemedText>
            </View>
            <InfoCard style={styles.cardOverride}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name="person-outline"
                    size={22}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                }
                label="Meus Dados"
                onPress={() => navigation.navigate("my-account")}
              />
              <View style={styles.separator} />
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"lock-outline"}
                    size={22}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                }
                label="Senha e Segurança"
                onPress={() => navigation.navigate("password-security")}
              />
              <View style={styles.separator} />
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"notifications-none"}
                    size={22}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                }
                label="Notificações"
                onPress={() => navigation.navigate("notifications-settings")}
              />
              <View style={styles.separator} />
              <SettingItem
                icon={
                  <MaterialDesignIcons
                    name="crown"
                    size={22}
                    color={DEFAULT_COLORS.crown}
                  />
                }
                label="Meu Plano"
                onPress={() => navigation.navigate("my-plan")}
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Suporte</ThemedText>
            </View>
            <InfoCard style={styles.cardOverride}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"info-outline"}
                    size={22}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                }
                label="Sobre Nós"
              />
              <View style={styles.separator} />
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"help-outline"}
                    size={22}
                    color={DEFAULT_COLORS.purpleBright}
                  />
                }
                label="Help Center"
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Sessão</ThemedText>
            </View>
            <InfoCard style={styles.cardOverride}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"logout"}
                    size={22}
                    color={DEFAULT_COLORS.danger}
                  />
                }
                label="Sair da Conta"
                onPress={() => setLogoutOpen(true)}
              />
            </InfoCard>
          </View>
        </Screen.Body>
      </Screen>

      <ModalBase
        visible={isLogoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleSignOut}
        title="Sair da Conta"
        description="Tem certeza que deseja sair?"
        confirmText="Sim, Sair"
        confirmVariant="tertiary"
        animationType="fade"
      />
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  contentBody: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginVertical: 10,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    color: DEFAULT_COLORS.purpleBright,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  cardOverride: {
    backgroundColor: SURFACES.card,
    borderColor: BORDERS.highlight,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADII.pill,
    backgroundColor: SURFACES.fill,
    borderWidth: 1,
    borderColor: BORDERS.subtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: DEFAULT_COLORS.white,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMuted,
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: BORDERS.divider,
    marginLeft: 50,
  },
});
