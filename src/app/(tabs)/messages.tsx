import React, { useState, useMemo } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { fonts } from "@/src/theme/fonts";
import { MenuPopup } from "@/src/components/menu-popup/menu-popup";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

interface MessageItem {
  id: string;
  userName: string;
  lastMessage: string;
  time: string;
  read: boolean;
  isPinned: boolean;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: "1",
    userName: "Roanokay",
    lastMessage: "Duis eu est sed tellus vestibulum facilisis.",
    time: "10:45",
    read: false,
    isPinned: false,
  },
  {
    id: "2",
    userName: "Morello",
    lastMessage: "Donec vel laoreet diam...",
    time: "15 fev",
    read: true,
    isPinned: false,
  },
  {
    id: "3",
    userName: "NemeanLion",
    lastMessage: "Nulla vel.",
    time: "01 Jan",
    read: true,
    isPinned: false,
  },
  {
    id: "4",
    userName: "Raspin",
    lastMessage: "Suspendisse vitae mi elit...",
    time: "31 Dez",
    read: true,
    isPinned: false,
  },
];

export default function Messages() {
  const { handleBack } = useBackRouter();

  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const isSelectionMode = selectedIds.length > 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setMessages(INITIAL_MESSAGES);
      setRefreshing(false);
    }, 2000);
  }, []);

  const sortedData = useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.isPinned === b.isPinned) return 0;
      return a.isPinned ? -1 : 1;
    });
  }, [messages]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handlePinAction = (shouldPin: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id) ? { ...m, isPinned: shouldPin } : m,
      ),
    );
    setSelectedIds([]);
  };

  const handleDelete = () => {
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
  };

  const handleMarkReadStatus = (isRead: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id) ? { ...m, read: isRead } : m,
      ),
    );
    setSelectedIds([]);
  };

  const renderItem = ({ item }: { item: MessageItem }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.messageCard,
          !item.read && styles.unreadCard,
          isSelected && styles.selectedCard,
        ]}
        activeOpacity={0.7}
        onLongPress={() => toggleSelection(item.id)}
        onPress={() =>
          isSelectionMode ? toggleSelection(item.id) : console.log("Abrir chat")
        }
      >
        <View style={styles.row}>
          <View
            style={[
              styles.avatarContainer,
              !item.read ? styles.unreadAvatarBorder : styles.readAvatarBorder,
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
              <FontAwesome5
                name="user"
                size={20}
                color={
                  !item.read
                    ? DEFAULT_COLORS.tertiary
                    : DEFAULT_COLORS.grays._400
                }
              />
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <View style={styles.nameContainer}>
                {item.isPinned && (
                  <MaterialCommunityIcons
                    name="pin"
                    size={14}
                    color={DEFAULT_COLORS.tertiary}
                    style={{ marginRight: 4 }}
                  />
                )}
                <ThemedText style={styles.userName}>{item.userName}</ThemedText>
              </View>
              <ThemedText style={styles.time}>{item.time}</ThemedText>
            </View>
            <ThemedText
              style={[styles.lastMessage, !item.read && styles.unreadText]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const menuOptions = () => {
    const hasSelection = selectedIds.length > 0;
    const selectedMessages = messages.filter((m) => selectedIds.includes(m.id));
    const allSelectedArePinned =
      selectedMessages.length > 0 && selectedMessages.every((m) => m.isPinned);

    const allSelectedAreRead =
      selectedMessages.length > 0 && selectedMessages.every((m) => m.read);

    return [
      {
        label: allSelectedArePinned ? "Desafixar do topo" : "Fixar no topo",
        icon: (
          <MaterialCommunityIcons
            name={allSelectedArePinned ? "pin-off-outline" : "pin-outline"}
            size={18}
            color={DEFAULT_COLORS.tertiary}
          />
        ),
        onPress: () => handlePinAction(!allSelectedArePinned),
      },
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
            : setSelectedIds(messages.map((m) => m.id)),
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
        label: "Apagar selecionadas",
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
            : "Mensagens"}
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
        data={sortedData}
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
            Nenhuma mensagem por aqui.
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
  listContent: { paddingBottom: 20 },
  messageCard: { width: "100%", paddingHorizontal: 16, paddingVertical: 15 },
  unreadCard: {
    backgroundColor: DEFAULT_COLORS.tertiary_20,
    borderLeftWidth: 3,
    borderLeftColor: DEFAULT_COLORS.tertiary,
  },
  selectedCard: {
    backgroundColor: "rgba(your-color, 0.1)",
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: DEFAULT_COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  unreadAvatarBorder: { borderColor: DEFAULT_COLORS.tertiary_30 },
  readAvatarBorder: { borderColor: "rgba(255, 255, 255, 0.05)" },
  content: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  nameContainer: { flexDirection: "row", alignItems: "center" },
  userName: { ...fonts.bold, fontSize: 16, color: DEFAULT_COLORS.white },
  time: { fontSize: 12, color: DEFAULT_COLORS.grays._400 },
  lastMessage: {
    fontSize: 14,
    color: DEFAULT_COLORS.grays._300,
    lineHeight: 18,
  },
  unreadText: { color: DEFAULT_COLORS.grays._200, ...fonts.medium },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "90%",
    alignSelf: "center",
  },
});
