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
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";

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
    backgroundColor: DEFAULT_COLORS.black_14,
  },
  menuContainer: {
    backgroundColor: SURFACES.card,
    borderRadius: RADII.md,
    padding: 4,
    width: 230,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    elevation: 10,
    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  arrow: {
    position: "absolute",
    top: -8,
    right: 12,
    width: 16,
    height: 16,
    backgroundColor: SURFACES.card,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: BORDERS.highlight,
    transform: [{ rotate: "45deg" }],
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS.divider,
    borderRadius: RADII.xs,
  },
  optionPressed: {
    backgroundColor: DEFAULT_COLORS.white_08,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
});
