import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { RADII } from "@/src/theme/tokens";
import { TOptions } from "@/src/interfaces";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

interface IProps {
  options: TOptions[];
  value: string[];
  onChange: (next: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

export const FilterChips = ({ options, value, onChange, style }: IProps) => {
  const toggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    onChange(
      isSelected
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll, style]}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const optionValue = String(option.value);
        const isSelected = value.includes(optionValue);

        return (
          <Pressable
            key={optionValue}
            onPress={() => toggle(optionValue)}
            style={({ pressed }) => [
              styles.chip,
              isSelected && styles.chipSelected,
              pressed && styles.chipPressed,
            ]}
          >
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={14}
                color={DEFAULT_COLORS.white}
              />
            )}
            <Text
              numberOfLines={1}
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {option.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
    paddingRight: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_35,
    backgroundColor: DEFAULT_COLORS.white_06,
  },
  chipSelected: {
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: DEFAULT_COLORS.tertiary_10,
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 2,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    ...fonts.medium,
    fontSize: 13,
    letterSpacing: 0.2,
    color: DEFAULT_COLORS.white_64,
  },
  chipTextSelected: {
    ...fonts.heavy,
    color: DEFAULT_COLORS.white,
  },
});
