import React, { useState } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Mail, MailOpen } from "lucide-react-native";
import { fonts } from "@/src/theme/fonts";
import { MenuPopup } from "@/src/components/menu-popup/menu-popup";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { WizardTowerIcon } from "@/src/components/icons";

interface NotificationItem {
  id: string;
  type:
    | "reminder"
    | "message"
    | "friend_request"
    | "campaign_request"
    | "mage_tower";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "5",
    type: "mage_tower",
    title: "Mensagem de Avalon, o Mestre",
    description:
      "Um sábio um dia disse: “Você pode encontrar as coisas que perdeu, mas nunca as que abandonou.”",
    time: "1h",
    read: false,
  },
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
  {
    id: "7",
    type: "friend_request",
    title: "Pedido de Amizade",
    description: "Rarik quer ser seu amigo!",
    time: "1h",
    read: true,
  },
  {
    id: "6",
    type: "mage_tower",
    title: "Mensagem de Avalon, o Mestre",
    description:
      "Citando outro famoso bruxo: “Não tenha pena dos mortos. Tenha pena dos vivos, e acima de tudo, daqueles que vivem sem amor.”",
    time: "1h",
    read: true,
  },
];

export default function Notifications() {
  const { handleBack } = useBackRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const isSelectionMode = selectedIds.length > 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setNotifications(INITIAL_NOTIFICATIONS);
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.includes(n.id) ? { ...n, read: true } : n)),
    );
    setSelectedIds([]);
  };

  const handleDelete = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

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
      campaign_request: <FontAwesome6 name="dungeon" {...iconProps} />,
      mage_tower: <WizardTowerIcon {...iconProps} />,
    };
    return icons[type] || icons.reminder;
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadCard,
          isSelected && styles.selectedCard,
        ]}
        activeOpacity={0.7}
        onLongPress={() => toggleSelection(item.id)}
        onPress={() => (isSelectionMode ? toggleSelection(item.id) : null)}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainer,
              isSelected && { borderColor: DEFAULT_COLORS.tertiary },
            ]}
          >
            {isSelected ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={DEFAULT_COLORS.tertiary}
              />
            ) : (
              renderIcon(
                item.type,
                !item.read
                  ? DEFAULT_COLORS.tertiary
                  : DEFAULT_COLORS.grays._400,
                item.read,
              )
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText style={styles.time}>{item.time}</ThemedText>
            </View>

            <ThemedText style={styles.description}>
              {item.description}
            </ThemedText>

            {!isSelectionMode && (
              <View style={styles.actionsRow}>
                {item.type === "campaign_request" && (
                  <TouchableOpacity
                    style={[styles.btnAction, styles.btnActionHighlight]}
                  >
                    <ThemedText style={styles.actionText}>
                      Ver Pedido
                    </ThemedText>
                  </TouchableOpacity>
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
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const menuOptions = () => {
    const hasSelection = selectedIds.length > 0;
    return [
      {
        label: hasSelection ? "Limpar Seleção" : "Selecionar Tudo",
        icon: (
          <Ionicons
            name={
              hasSelection ? "close-circle-outline" : "checkmark-done-outline"
            }
            size={18}
            color={DEFAULT_COLORS.tertiary}
          />
        ),
        onPress: () =>
          hasSelection
            ? setSelectedIds([])
            : setSelectedIds(notifications.map((n) => n.id)),
      },
      {
        label: "Marcar como lidas",
        icon: (
          <MaterialCommunityIcons
            name="email-open-outline"
            size={18}
            color={DEFAULT_COLORS.tertiary}
          />
        ),
        onPress: handleMarkAsRead,
      },
      {
        label: "Limpar selecionadas",
        icon: (
          <Ionicons
            name="trash-outline"
            size={18}
            color={DEFAULT_COLORS.danger}
          />
        ),
        onPress: handleDelete,
      },
    ];
  };

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
        <ThemedText style={styles.headerTitle}>
          {isSelectionMode
            ? `${selectedIds.length} selecionada(s)`
            : "Notificações"}
        </ThemedText>

        <MenuPopup
          trigger={
            <MaterialDesignIcons
              name="dots-vertical-circle-outline"
              size={32}
              color={DEFAULT_COLORS.tertiary}
            />
          }
          options={menuOptions()}
        />
      </HeaderActions>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
        ListEmptyComponent={
          <ThemedText
            style={{
              textAlign: "center",
              marginTop: 40,
              color: DEFAULT_COLORS.grays._300,
            }}
          >
            Nenhuma notificação por aqui.
          </ThemedText>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, ...fonts.bold, color: DEFAULT_COLORS.white },
  clearAll: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
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
  selectedCard: {
    backgroundColor: "rgba(your-color, 0.1)",
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
  title: { ...fonts.bold, fontSize: 16, color: DEFAULT_COLORS.white },
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
  btnActionHighlight: { backgroundColor: DEFAULT_COLORS.tertiary },
  actionText: {
    fontSize: 11,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
    textTransform: "uppercase",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "90%",
    alignSelf: "center",
  },
});
