import React, { ReactNode, useRef, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ThemedText } from "../themed-text/themed-text";
import { fonts } from "@/src/theme/fonts";

export interface MenuOption {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  isDestructive?: boolean;
}

interface MenuPopupProps {
  options: MenuOption[];
  trigger: ReactNode | ((isOpen: boolean) => ReactNode);
  containerStyle?: ViewStyle;
}

export const MenuPopup: React.FC<MenuPopupProps> = ({
  options,
  trigger,
  containerStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 20 });
  const triggerRef = useRef<View>(null);

  const toggleMenu = () => {
    if (!visible) {
      triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY + height,
          right: 20,
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  };

  const renderTrigger = () => {
    if (typeof trigger === "function") {
      return trigger(visible);
    }
    return trigger;
  };

  return (
    <View style={containerStyle} ref={triggerRef} collapsable={false}>
      <Pressable onPress={toggleMenu} style={styles.triggerBtn}>
        {renderTrigger()}
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuContainer,
                  {
                    position: "absolute",
                    top: menuPosition.top,
                    right: menuPosition.right,
                  },
                ]}
              >
                <View style={styles.arrow} />

                {options.map((item, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && styles.optionPressed,
                      index === options.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => {
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      );
                      item.onPress();
                      setVisible(false);
                    }}
                  >
                    {item.icon}
                    <ThemedText
                      style={[
                        styles.optionText,
                        item.isDestructive && { color: DEFAULT_COLORS.danger },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  triggerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  menuContainer: {
    backgroundColor: "rgba(26, 26, 46, 0.98)",
    borderRadius: 12,
    padding: 4,
    width: 220,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.3)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  arrow: {
    position: "absolute",
    top: -8,
    right: 12,
    width: 16,
    height: 16,
    backgroundColor: "rgba(26, 26, 46, 0.98)",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.3)",
    transform: [{ rotate: "45deg" }],
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  optionPressed: {
    backgroundColor: "rgba(126, 135, 226, 0.15)",
  },
  optionText: {
    marginLeft: 12,
    fontSize: 15,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
});
