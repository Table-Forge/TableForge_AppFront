import React from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { ActionButton } from "@/src/components/action-button/action-button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { fonts } from "@/src/theme/fonts";

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

  const renderItem = ({ item }: { item: MessageItem }) => (
    <TouchableOpacity
      style={[styles.messageCard, !item.read && styles.unreadCard]}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.avatarContainer,
            !item.read ? styles.unreadAvatarBorder : styles.readAvatarBorder,
          ]}
        >
          <FontAwesome5
            name="user"
            size={20}
            color={
              !item.read ? DEFAULT_COLORS.tertiary : DEFAULT_COLORS.grays._400
            }
          />
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
        <View style={{ width: 40 }} />
      </HeaderActions>

      <TouchableOpacity style={styles.clearAll}>
        <FontAwesome5 name="broom" size={14} color={DEFAULT_COLORS.tertiary} />
        <ThemedText style={styles.clearAllText}>Limpar todas</ThemedText>
      </TouchableOpacity>

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
