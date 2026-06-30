import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Input } from "@/src/components/input/input";
import { ActionButton } from "@/src/components/action-button/action-button";
import { Screen } from "@/src/components/screen/screen";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
  isSending?: boolean;
  placeholder?: string;
  backgroundColor?: string;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  placeholder = "Escreva uma mensagem...",
  backgroundColor = SURFACES.cardAlt,
}: ChatInputProps) {
  const latestTextRef = useRef(value);

  useEffect(() => {
    latestTextRef.current = value;
  }, [value]);

  const handleChangeText = (text: string) => {
    latestTextRef.current = text;
    onChangeText(text);
  };

  const handleSendPress = () => {
    setTimeout(() => onSend(latestTextRef.current), 0);
  };

  const isSendDisabled = !value.trim();

  return (
    <Screen.Footer>
      <View style={[styles.inputBar, { backgroundColor }]}>
        <View style={styles.inputWrapper}>
          <Input
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            multiline={true}
            style={styles.inputStyle}
          />
        </View>
        <ActionButton
          variant="circle"
          active
          icon={<Ionicons name="send" size={20} color={DEFAULT_COLORS.white} />}
          onPress={isSendDisabled ? undefined : handleSendPress}
          style={isSendDisabled ? styles.sendButtonDisabled : null}
        />
      </View>
    </Screen.Footer>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: BORDERS.divider,
    borderRadius: RADII.lg,
    ...SHADOWS.floating,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: -4,
  },
  inputStyle: {
    maxHeight: 120,
    paddingTop: 14,
    paddingBottom: 14,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
