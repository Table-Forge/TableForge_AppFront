import React, { useState } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { ActionButton } from "@/src/components/action-button/action-button";
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
}

const MESSAGES_MOCK: MessageItem[] = [
  {
    id: "1",
    userName: "Roanokay",
    lastMessage: "Duis eu est sed tellus vestibulum facilisis.",
    time: "10:45",
    read: false,
  },
  {
    id: "2",
    userName: "Morello",
    lastMessage:
      "Donec vel laoreet diam. In ipsum felis, hendrerit sit amet lobortis quis...",
    time: "15 fev",
    read: true,
  },
  {
    id: "3",
    userName: "NemeanLion",
    lastMessage: "Nulla vel.",
    time: "01 Jan",
    read: true,
  },
  {
    id: "4",
    userName: "Raspin",
    lastMessage:
      "Suspendisse vitae mi elit. Nunc rhoncus eros id aliquam egestas...",
    time: "31 Dez",
    read: true,
  },
];

export default function Messages() {
  const { handleBack } = useBackRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const isSelectionMode = selectedIds.length > 0;

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
        onPress={() => {
          if (isSelectionMode) {
            toggleSelection(item.id);
          } else {
            console.log("Abrir mensagem");
          }
        }}
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
              <ThemedText style={styles.userName}>{item.userName}</ThemedText>
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
        onPress: () => {
          if (hasSelection) setSelectedIds([]);
          else setSelectedIds(MESSAGES_MOCK.map((m) => m.id));
        },
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
        onPress: () => {
          // Lógica para marcar selectedIds ou todas como lidas
        },
      },
      {
        label: "Apagar selecionadas",
        icon: <Ionicons name="trash-outline" size={18} color="#FF4444" />,
        onPress: () => {
          // Lógica de delete
        },
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
        <ThemedText style={styles.headerTitle}>Mensagens</ThemedText>

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
        style={{ width: "100%" }}
        data={MESSAGES_MOCK}
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

  listContent: { paddingBottom: 20 },

  messageCard: {
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
    backgroundColor: "rgba(your-color, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: DEFAULT_COLORS.tertiary,
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
  userName: {
    ...fonts.bold,
    fontSize: 16,
    color: DEFAULT_COLORS.white,
  },
  time: { fontSize: 12, color: DEFAULT_COLORS.grays._400 },
  lastMessage: {
    fontSize: 14,
    color: DEFAULT_COLORS.grays._300,
    lineHeight: 18,
  },
  unreadText: {
    color: DEFAULT_COLORS.grays._100,
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    width: "90%",
    alignSelf: "center",
  },
});
