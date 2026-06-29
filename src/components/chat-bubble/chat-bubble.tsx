import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

export interface ChatBubbleProps {
  content: string;
  isMine: boolean;
  timeText?: string;
  avatarUrl?: string;
  senderName?: string;
  isRead?: boolean;
  showReadReceipt?: boolean;
  showAvatar?: boolean;
  onAvatarPress?: () => void;
}

export function ChatBubble({
  content,
  isMine,
  timeText,
  avatarUrl,
  senderName,
  isRead,
  showReadReceipt = false,
  showAvatar = false,
  onAvatarPress,
}: ChatBubbleProps) {
  const renderAvatar = () => {
    if (!showAvatar) return null;

    const Wrapper = onAvatarPress ? React.Fragment : View;

    const content = !avatarUrl ? (
      <View style={[styles.avatarImage, { alignItems: "center", justifyContent: "center" }]}>
        <FontAwesome6 name="user" size={12} color={DEFAULT_COLORS.tertiary} />
      </View>
    ) : (
      <Image
        source={{ uri: avatarUrl }}
        style={styles.avatarImage}
        resizeMode="cover"
      />
    );

    if (onAvatarPress) {
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={onAvatarPress}>
          {content}
        </TouchableOpacity>
      );
    }

    return content;
  };

  return (
    <View style={[styles.messageRow, isMine && styles.myMessageRow]}>
      {!isMine && renderAvatar()}
      <View style={[styles.messageStack, isMine && styles.myMessageStack]}>
        {!!senderName && (
          <ThemedText style={[styles.username, isMine && styles.usernameMine]}>
            {senderName}
          </ThemedText>
        )}
        <View style={[styles.bubble, isMine && styles.myBubble]}>
          <ThemedText style={styles.messageText}>{content}</ThemedText>
        </View>
        {(!!timeText || showReadReceipt) && (
          <View style={styles.statusRow}>
            {!!timeText && (
              <ThemedText style={[styles.messageTime, isMine && styles.myMessageTime]}>
                {timeText}
              </ThemedText>
            )}
            {isMine && showReadReceipt && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color={isRead ? DEFAULT_COLORS.secondary : DEFAULT_COLORS.textMuted}
                style={styles.statusIcon}
              />
            )}
          </View>
        )}
      </View>
      {isMine && renderAvatar()}
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  messageStack: {
    maxWidth: "82%",
  },
  myMessageStack: {
    alignItems: "flex-end",
  },
  username: {
    marginBottom: 4,
    fontSize: 10,
    color: DEFAULT_COLORS.tertiary,
    letterSpacing: 1,
    textTransform: "uppercase",
    ...fonts.bold,
  },
  usernameMine: {
    color: DEFAULT_COLORS.crown,
    textAlign: "right",
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SURFACES.fillStrong,
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDERS.divider,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADII.xs,
    backgroundColor: SURFACES.card,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  myBubble: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_25,
    borderColor: BORDERS.cta,
  },
  messageText: {
    fontSize: 13,
    color: DEFAULT_COLORS.white,
    lineHeight: 17,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    color: DEFAULT_COLORS.textMuted,
  },
  myMessageTime: {
    textAlign: "right",
  },
  statusIcon: {
    marginTop: 2,
  },
});
