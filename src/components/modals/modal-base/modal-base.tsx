import React, { ReactNode } from "react";
import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/src/components/button/button";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

interface GenericModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "tertiary" | "tertiary";
  showFooter?: boolean;
  animationType?: ModalProps["animationType"];
}

export const ModalBase = ({
  visible,
  onClose,
  title,
  description,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  confirmVariant = "tertiary",
  showFooter = true,
  animationType = "fade",
}: GenericModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.container}
        >
          <Text style={styles.eyebrow}>Confirmação</Text>
          <Text style={styles.title}>{title}</Text>

          {description && <Text style={styles.message}>{description}</Text>}

          {children && <View style={styles.content}>{children}</View>}

          {showFooter && (
            <View style={styles.buttonContainer}>
              <View style={styles.buttonSlot}>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={onClose}
                  text={cancelText}
                />
              </View>

              {onConfirm && (
                <View style={styles.buttonSlot}>
                  <Button
                    variant={confirmVariant}
                    size="sm"
                    onPress={onConfirm}
                    text={confirmText}
                  />
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: SURFACES.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: SURFACES.card,
    borderRadius: RADII.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    gap: 6,
    ...SHADOWS.card,
  },
  eyebrow: {
    ...fonts.bold,
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    ...fonts.heavy,
    color: DEFAULT_COLORS.white,
    fontSize: 20,
    marginBottom: 4,
  },
  message: {
    ...fonts.regular,
    color: DEFAULT_COLORS.textMutedLight,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  content: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  buttonSlot: {
    flex: 1,
  },
});
