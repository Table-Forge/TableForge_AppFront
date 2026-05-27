import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TOptions, TPrimitives } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { ThemedText } from "../themed-text/themed-text";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useScrollToFocusedInput } from "@/src/context/scroll-to-focused-input";
import { normalizeString } from "@/src/utils/format";

interface IProps {
  options: TOptions[];
  value?: TPrimitives;
  onSelect: (value: TPrimitives | undefined) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const Select: React.FC<IProps> = ({
  options,
  value,
  onSelect,
  placeholder = "Selecione...",
  error,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<View>(null);
  const { scrollToFocusedInput } = useScrollToFocusedInput();

  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = Boolean(selectedOption);
  const filteredOptions = useMemo(() => {
    const normalizedSearch = normalizeString(search);

    if (!normalizedSearch) return options;

    const filtered = options.filter((option) =>
      normalizeString(option.name).includes(normalizedSearch),
    );

    if (
      selectedOption &&
      !filtered.some((option) => option.value === selectedOption.value)
    ) {
      return [selectedOption, ...filtered];
    }

    return filtered;
  }, [options, search, selectedOption]);

  const handleVisibleChange = (nextVisible: boolean) => {
    setVisible(nextVisible);

    if (!nextVisible) {
      setSearch("");
    }
  };

  const handlePressOption = (item: TOptions) => {
    onSelect(item.value);
    handleVisibleChange(false);
  };

  return (
    <View ref={containerRef} collapsable={false} style={styles.container}>
      <TouchableOpacity
        style={[
          styles.trigger,
          visible ? styles.triggerActive : null,
          hasValue ? styles.triggerFilled : null,
          error ? styles.borderError : null,
          disabled ? styles.triggerDisabled : null,
        ]}
        onPress={() => {
          if (disabled) return;
          scrollToFocusedInput(containerRef);
          handleVisibleChange(true);
        }}
        activeOpacity={0.85}
      >
        <View style={styles.triggerContent}>
          <View
            style={[
              styles.statusMark,
              visible ? styles.statusMarkActive : null,
              hasValue ? styles.statusMarkFilled : null,
              error ? styles.statusMarkError : null,
              disabled ? styles.statusMarkDisabled : null,
            ]}
          >
            <MaterialCommunityIcons
              name={hasValue ? "check-bold" : "cards-diamond-outline"}
              size={hasValue ? 10 : 12}
              color={
                hasValue || visible
                  ? DEFAULT_COLORS.white
                  : DEFAULT_COLORS.white_35
              }
            />
          </View>

          <ThemedText
            style={[
              styles.triggerText,
              !selectedOption && styles.placeholder,
              disabled && styles.textDisabled,
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </ThemedText>
        </View>

        <MaterialCommunityIcons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color={disabled ? DEFAULT_COLORS.white_25 : DEFAULT_COLORS.white}
        />
      </TouchableOpacity>

      {error && <ErrorMessage text={error} />}

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => handleVisibleChange(false)}
      >
        <TouchableWithoutFeedback onPress={() => handleVisibleChange(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.handle} />

                <ThemedText weight="bold" style={styles.sheetTitle}>
                  Selecione uma opção
                </ThemedText>

                <View style={styles.searchContainer}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color={DEFAULT_COLORS.textMutedLight}
                  />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Pesquisar"
                    placeholderTextColor={DEFAULT_COLORS.white_35}
                    style={styles.searchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {!!search && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color={DEFAULT_COLORS.textMutedLight}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>
                      Nenhum item encontrado.
                    </ThemedText>
                  }
                  renderItem={({ item }) => {
                    const isSelected = item.value === value;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          isSelected && styles.selectedOption,
                        ]}
                        onPress={() => handlePressOption(item)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {item.name}
                        </Text>
                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check-decagram"
                            size={18}
                            color={DEFAULT_COLORS.purpleBright}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: SURFACES.fill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    borderRadius: RADII.md,
    paddingHorizontal: 16,
    height: 52,
  },
  triggerActive: {
    borderColor: BORDERS.highlightStrong,
    backgroundColor: SURFACES.fillStrong,
  },
  triggerFilled: {
    borderColor: BORDERS.highlightStrong,
  },
  triggerDisabled: {
    backgroundColor: DEFAULT_COLORS.white_05,
    borderColor: DEFAULT_COLORS.white_10,
    opacity: 0.75,
  },
  borderError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  triggerText: {
    fontSize: 15,
    color: DEFAULT_COLORS.white,
    ...fonts.regular,
    flex: 1,
  },
  placeholder: {
    color: DEFAULT_COLORS.white_35,
  },
  textDisabled: {
    color: DEFAULT_COLORS.white_35,
  },
  triggerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  statusMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.white_06,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
  },
  statusMarkActive: {
    backgroundColor: DEFAULT_COLORS.white_08,
    borderColor: BORDERS.highlightStrong,
  },
  statusMarkFilled: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
    borderColor: DEFAULT_COLORS.white,
  },
  statusMarkError: {
    backgroundColor: DEFAULT_COLORS.danger,
    borderColor: DEFAULT_COLORS.danger,
  },
  statusMarkDisabled: {
    backgroundColor: DEFAULT_COLORS.white_08,
    borderColor: DEFAULT_COLORS.white_08,
  },
  overlay: {
    flex: 1,
    backgroundColor: SURFACES.overlayStrong,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: SURFACES.card,
    borderTopLeftRadius: RADII.xxl,
    borderTopRightRadius: RADII.xxl,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "50%",
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: DEFAULT_COLORS.white_25,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  sheetTitle: {
    fontSize: 12,
    textAlign: "center",
    color: DEFAULT_COLORS.purpleBright,
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  searchContainer: {
    height: 48,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.fill,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: DEFAULT_COLORS.white,
    fontSize: 15,
    ...fonts.regular,
  },
  option: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS.subtle,
  },
  selectedOption: {
    backgroundColor: DEFAULT_COLORS.secondary_10,
  },
  optionText: {
    ...fonts.regular,
    fontSize: 15,
    color: DEFAULT_COLORS.white_70,
    textAlign: "center",
  },
  selectedOptionText: {
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  emptyText: {
    fontSize: 14,
    color: DEFAULT_COLORS.white_35,
    textAlign: "center",
    paddingVertical: 24,
  },
});
