import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Mail, MailOpen } from "lucide-react-native";

import { WizardTowerIcon } from "@/src/components/icons";
import { Screen } from "@/src/components/screen/screen";
import { MenuPopup } from "@/src/components/menu-popup/menu-popup";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useAuth } from "@/src/context/auth";
import { useNotifications } from "@/src/features/notifications/hooks/use-notifications";
import { useNotificationsMutation } from "@/src/features/notifications/hooks/use-notifications-mutations";
import { INotification } from "@/src/features/notifications/schemas/notification.schema";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
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
    markAllNotificationsAsReadMutation,
    updateNotificationMutation,
  } = useNotificationsMutation();

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const timer = setTimeout(() => {
        markAllNotificationsAsReadMutation.mutate(userId);
      }, 2000);

      return () => clearTimeout(timer);
    }, [userId, markAllNotificationsAsReadMutation])
  );

  const handleNotificationPress = (item: INotification) => {
    if (!item.read) {
      markNotificationAsReadMutation.mutate(item.id);
    }
    if (item.relatedLink) {
      router.push(item.relatedLink as any);
    }
  };

  const notifications = useMemo(
    () => notificationsQuery.data?.items ?? [],
    [notificationsQuery.data?.items],
  );
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
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
      JoinRequestRejected: (
        <Ionicons name="close-circle-outline" {...iconProps} />
      ),
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
        activeOpacity={0.8}
        onLongPress={() => toggleSelection(item.id)}
        onPress={() =>
          isSelectionMode
            ? toggleSelection(item.id)
            : handleNotificationPress(item)
        }
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainer,
              !item.read && styles.iconContainerUnread,
              isSelected && styles.iconContainerSelected,
            ]}
          >
            {isSelected ? (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={DEFAULT_COLORS.orange}
              />
            ) : (
              renderIcon(
                item.type,
                !item.read
                  ? DEFAULT_COLORS.orange
                  : DEFAULT_COLORS.purpleBright,
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
            color={DEFAULT_COLORS.purpleBright}
          />
        ),
        onPress: () =>
          hasSelection
            ? setSelectedIds([])
            : setSelectedIds(
                notifications.map((notification) => notification.id),
              ),
      },
      {
        label: allSelectedAreRead ? "Marcar como não lida" : "Marcar como lida",
        icon: (
          <MaterialCommunityIcons
            name={allSelectedAreRead ? "email-outline" : "email-open-outline"}
            size={18}
            color={DEFAULT_COLORS.purpleBright}
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

  const subtitle = isSelectionMode
    ? `${selectedIds.length} selecionada(s)`
    : unreadCount > 0
      ? `${unreadCount} nova${unreadCount === 1 ? "" : "s"}`
      : "Tudo em dia";

  return (
    <Screen style={styles.screen}>
      <Screen.Header style={styles.topWrapper}>
        <View style={styles.titleWrapper}>
          <ThemedText weight="bold" style={styles.eyebrow}>
            Inbox místico
          </ThemedText>
          <View style={styles.titleRow}>
            <FontAwesome6
              name="scroll"
              size={16}
              color={DEFAULT_COLORS.secondary}
              style={styles.titleIcon}
            />
            <ThemedText weight="bold" style={styles.titleValue}>
              {subtitle}
            </ThemedText>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.menuButton}>
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
          </View>
        </View>
      </Screen.Header>

      <Screen.Body>
        <View style={styles.sectionHeader}>
          <ThemedText weight="bold" style={styles.sectionTitle}>
            Notificações
          </ThemedText>
          <View style={styles.sectionLine} />
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.list}
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <ThemedText style={styles.emptyText}>
                {notificationsQuery.isError
                  ? "Não foi possível carregar as notificações."
                  : "Nenhuma notificação por aqui."}
              </ThemedText>
            </View>
          }
          refreshing={notificationsQuery.isRefetching}
          onRefresh={notificationsQuery.refetch}
        />
      </Screen.Body>
    </Screen>
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
  screen: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.background,
  },
  topWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  eyebrow: {
    fontSize: 11,
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_65,
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titleIcon: {
    textShadowColor: DEFAULT_COLORS.secondary_50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleValue: {
    fontSize: 18,
    color: DEFAULT_COLORS.white,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: RADII.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.primary_80,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.secondary_30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: DEFAULT_COLORS.tertiary_20,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexGrow: 1,
    gap: 10,
  },
  notificationCard: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  unreadCard: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_07,
    borderColor: BORDERS.ctaSoft,
  },
  selectedCard: {
    borderColor: BORDERS.cta,
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADII.md,
    backgroundColor: SURFACES.fill,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  iconContainerUnread: {
    borderColor: BORDERS.ctaSoft,
    backgroundColor: DEFAULT_COLORS.orangeGlow_07,
  },
  iconContainerSelected: {
    borderColor: BORDERS.cta,
  },
  content: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  title: { ...fonts.bold, fontSize: 15, color: DEFAULT_COLORS.white },
  time: { fontSize: 11, color: DEFAULT_COLORS.textMuted, letterSpacing: 0.3 },
  description: {
    fontSize: 13,
    color: DEFAULT_COLORS.textMutedLight,
    lineHeight: 18,
  },
  separator: {
    height: 0,
  },
  emptyWrapper: {
    marginTop: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white_10,
    borderRadius: 12,
    padding: 18,
    backgroundColor: DEFAULT_COLORS.primary_45,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: DEFAULT_COLORS.grays?._200 || DEFAULT_COLORS.white_70,
    textAlign: "center",
  },
});
