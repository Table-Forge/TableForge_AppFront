import React, { useMemo, useState } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Mail, MailOpen } from "lucide-react-native";

import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { WizardTowerIcon } from "@/src/components/icons";
import { MainContainer } from "@/src/components/main-container/main-container";
import { MenuPopup } from "@/src/components/menu-popup/menu-popup";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { useNotificationsMutation } from "@/src/features/notifications/hooks/use-notifications-mutations";
import { INotification } from "@/src/features/notifications/schemas/notification.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";

export default function Notifications() {
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const notificationsQuery = useNotifications({
    page: 1,
    size: 50,
    userId,
    enabled: Boolean(userId),
  });
  const {
    deleteNotificationMutation,
    markNotificationAsReadMutation,
    updateNotificationMutation,
  } = useNotificationsMutation();

  const notifications = useMemo(
    () => notificationsQuery.data?.items ?? [],
    [notificationsQuery.data?.items],
  );
  const isSelectionMode = selectedIds.length > 0;

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleDelete = () => {
    selectedIds.forEach((id) => deleteNotificationMutation.mutate(id));
    setSelectedIds([]);
  };

  const handleMarkReadStatus = (isRead: boolean) => {
    selectedIds.forEach((id) => {
      if (isRead) {
        markNotificationAsReadMutation.mutate(id);
        return;
      }

      updateNotificationMutation.mutate({ id, read: false });
    });
    setSelectedIds([]);
  };

  const renderIcon = (type: string, color: string, isRead: boolean) => {
    const iconProps = { size: 22, color };

    const icons: Record<string, React.ReactNode> = {
      CampaignInvite: <FontAwesome6 name="dungeon" {...iconProps} />,
      JoinRequestApproved: (
        <Ionicons name="checkmark-circle-outline" {...iconProps} />
      ),
      JoinRequestRejected: <Ionicons name="close-circle-outline" {...iconProps} />,
      NewChatMessage: isRead ? (
        <MailOpen {...iconProps} />
      ) : (
        <Mail {...iconProps} />
      ),
      NewAnnouncement: (
        <Ionicons name="notifications-outline" {...iconProps} />
      ),
      FriendshipRequest: <Ionicons name="person-add-outline" {...iconProps} />,
      FriendshipAccepted: <Ionicons name="people-outline" {...iconProps} />,
      System: <WizardTowerIcon {...iconProps} />,
    };

    return icons[type] || icons.System;
  };

  const renderItem = ({ item }: { item: INotification }) => {
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
              <ThemedText style={styles.title}>
                {getNotificationTitle(item.type)}
              </ThemedText>
              <ThemedText style={styles.time}>
                {formatNotificationDate(item.createdAt)}
              </ThemedText>
            </View>

            <ThemedText style={styles.description}>{item.message}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const menuOptions = () => {
    const hasSelection = selectedIds.length > 0;
    const selectedNotifications = notifications.filter((notification) =>
      selectedIds.includes(notification.id),
    );
    const allSelectedAreRead =
      selectedNotifications.length > 0 &&
      selectedNotifications.every((notification) => notification.read);

    return [
      {
        label: hasSelection ? "Limpar seleção" : "Selecionar tudo",
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
            : setSelectedIds(notifications.map((notification) => notification.id)),
      },
      {
        label: allSelectedAreRead ? "Marcar como não lida" : "Marcar como lida",
        icon: (
          <MaterialCommunityIcons
            name={allSelectedAreRead ? "email-outline" : "email-open-outline"}
            size={18}
            color={DEFAULT_COLORS.tertiary}
          />
        ),
        onPress: () => handleMarkReadStatus(!allSelectedAreRead),
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
              color={DEFAULT_COLORS.white}
            />
          }
          options={menuOptions()}
        />
      </HeaderActions>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
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
            {notificationsQuery.isError
              ? "Não foi possível carregar as notificações."
              : "Nenhuma notificação por aqui."}
          </ThemedText>
        }
        refreshing={notificationsQuery.isRefetching}
        onRefresh={notificationsQuery.refetch}
      />
    </MainContainer>
  );
}

function getNotificationTitle(type: string) {
  const titles: Record<string, string> = {
    CampaignInvite: "Convite de campanha",
    JoinRequestApproved: "Entrada aprovada",
    JoinRequestRejected: "Entrada recusada",
    NewChatMessage: "Nova mensagem",
    NewAnnouncement: "Novo comunicado",
    FriendshipRequest: "Pedido de amizade",
    FriendshipAccepted: "Amizade aceita",
    System: "Mensagem do sistema",
  };

  return titles[type] || "Notificação";
}

function formatNotificationDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 20, ...fonts.bold, color: DEFAULT_COLORS.white },
  listContent: { paddingBottom: 20 },
  notificationCard: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },
  unreadCard: {
    backgroundColor: DEFAULT_COLORS.tertiary_20,
    borderLeftWidth: 3,
    borderLeftColor: DEFAULT_COLORS.tertiary,
  },
  selectedCard: {
    backgroundColor: "rgba(126, 135, 226, 0.1)",
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
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "90%",
    alignSelf: "center",
  },
});
