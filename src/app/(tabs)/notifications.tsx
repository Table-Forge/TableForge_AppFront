import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { Mail, MailOpen } from "lucide-react-native";
import { fonts } from "@/src/theme/fonts";

interface NotificationItem {
  id: string;
  type: "reminder" | "message" | "friend_request" | "campaign_request";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS_MOCK: NotificationItem[] = [
  {
    id: "1",
    type: "reminder",
    title: "Lembrete!",
    description:
      'A mesa da campanha "O Cerco de Valkaria" começará em 2 horas.',
    time: "32min",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "Nova mensagem",
    description: "Amanda te enviou uma mensagem.",
    time: "1h",
    read: false,
  },
  {
    id: "3",
    type: "friend_request",
    title: "Pedido de Amizade",
    description: "Luciano quer ser seu amigo!",
    time: "1h",
    read: false,
  },
  {
    id: "4",
    type: "campaign_request",
    title: "Pedido de Entrada",
    description:
      'Luciano pediu para entrar na sua campanha "O Cerco de Valkaria"!',
    time: "1h",
    read: true,
  },
];

export default function Notifications() {
  const { handleBack } = useBackRouter();

  const renderIcon = (
    type: NotificationItem["type"],
    color: string,
    isRead: boolean,
  ) => {
    const iconProps = { size: 22, color: color };

    const icons = {
      reminder: <Ionicons name="notifications-outline" {...iconProps} />,
      message: isRead ? <MailOpen {...iconProps} /> : <Mail {...iconProps} />,
      friend_request: <Ionicons name="person-add-outline" {...iconProps} />,
      campaign_request: <MaterialCommunityIcons name="castle" {...iconProps} />,
    };

    return icons[type] || icons.reminder;
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          {renderIcon(
            item.type,
            !item.read ? DEFAULT_COLORS.tertiary : DEFAULT_COLORS.grays._400,
            item.read,
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.time}>{item.time}</ThemedText>
          </View>

          <ThemedText style={styles.description}>{item.description}</ThemedText>

          <View style={styles.actionsRow}>
            {item.type === "campaign_request" && (
              <>
                <TouchableOpacity
                  style={[styles.btnAction, styles.btnActionHighlight]}
                >
                  <ThemedText style={styles.actionText}>Ver Pedido</ThemedText>
                </TouchableOpacity>
              </>
            )}
            {(item.type === "friend_request" ||
              item.type === "campaign_request") && (
              <>
                <TouchableOpacity
                  style={[styles.btnAction, styles.btnActionHighlight]}
                >
                  <ThemedText style={styles.actionText}>Aceitar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAction}>
                  <ThemedText style={styles.actionText}>Recusar</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <MainContainer>
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
        <ThemedText style={styles.headerTitle}>Notificações</ThemedText>
        <View style={{ width: 40 }} />
      </HeaderActions>

      <TouchableOpacity style={styles.clearAll}>
        <FontAwesome5 name="broom" size={14} color={DEFAULT_COLORS.tertiary} />
        <ThemedText style={styles.clearAllText}>Limpar todas</ThemedText>
      </TouchableOpacity>

      <FlatList
        style={{ width: "100%" }}
        data={NOTIFICATIONS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, ...fonts.bold },
  clearAll: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    gap: 4,
  },
  clearAllText: {
    color: DEFAULT_COLORS.tertiary,
    fontSize: 14,
    ...fonts.medium,
  },
  listContent: { paddingBottom: 20 },

  notificationCard: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },

  unreadCard: {
    backgroundColor: DEFAULT_COLORS.tertiary_50,
    borderLeftWidth: 3,
    borderLeftColor: DEFAULT_COLORS.tertiary,
  },

  row: { flexDirection: "row" },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DEFAULT_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.tertiary_20,
  },

  content: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    ...fonts.bold,
    fontSize: 16,
    color: DEFAULT_COLORS.white,
  },
  time: { fontSize: 12, color: DEFAULT_COLORS.grays._400 },
  description: {
    fontSize: 14,
    color: DEFAULT_COLORS.grays._300,
    lineHeight: 18,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },

  btnAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: DEFAULT_COLORS.grays._500,
    justifyContent: "center",
    alignItems: "center",
  },
  btnActionHighlight: {
    backgroundColor: DEFAULT_COLORS.tertiary,
  },
  actionText: {
    fontSize: 12,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
    textTransform: "uppercase",
    textAlign: "center",
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "90%",
    alignSelf: "center",
  },
});
