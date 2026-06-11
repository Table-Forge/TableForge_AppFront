import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { PASSWORD_RULES } from "@/src/utils/custom-schema-validations";

export function PasswordRequirements({ value }: { value?: string }) {
  const password = value ?? "";

  return (
    <View style={styles.container}>
      {PASSWORD_RULES.map((rule) => {
        const isValid = rule.test(password);
        const color = isValid ? DEFAULT_COLORS.success : DEFAULT_COLORS.danger;

        return (
          <View key={rule.label} style={styles.row}>
            <Ionicons
              name={isValid ? "checkmark-circle" : "close-circle"}
              size={14}
              color={color}
            />
            <ThemedText style={[styles.label, { color }]}>
              {rule.label}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
});
