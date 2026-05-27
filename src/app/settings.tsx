import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { InfoCard } from "@/src/components/info-card/info-card";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";

import React, { useState } from "react";
import { useAuth } from "@/src/context/auth";
import { ModalBase } from "@/src/components/modals/modal-base/modal-base";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { fonts } from "@/src/theme/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
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
          color="rgba(255,255,255,0.3)"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={[{ flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={styles.contentBody}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Conta</ThemedText>
            </View>
            <InfoCard style={{ backgroundColor: DEFAULT_COLORS.primary }}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name="person-outline"
                    size={22}
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Meus Dados"
                onPress={() => navigation.navigate("my-account")}
              />
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"lock-outline"}
                    size={22}
                    color={DEFAULT_COLORS.white}
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
                    color={DEFAULT_COLORS.white}
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
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Meu Plano"
                onPress={() => navigation.navigate("my-plan")}
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Suporte</ThemedText>
            </View>
            <InfoCard style={{ backgroundColor: DEFAULT_COLORS.primary }}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"info-outline"}
                    size={22}
                    color={DEFAULT_COLORS.white}
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
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Help Center"
              />
            </InfoCard>

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Sessão</ThemedText>
            </View>
            <InfoCard style={{ backgroundColor: DEFAULT_COLORS.primary }}>
              <SettingItem
                icon={
                  <MaterialIcons
                    name={"logout"}
                    size={22}
                    color={DEFAULT_COLORS.white}
                  />
                }
                label="Sair da Conta"
                onPress={() => setLogoutOpen(true)}
              />
            </InfoCard>
          </View>
        </ScrollView>
      </SafeAreaView>

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
  headerTitle: {
    fontSize: 20,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
  contentBody: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginVertical: 10,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    opacity: 0.6,
    ...fonts.medium,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.5,
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: 48,
  },
});
