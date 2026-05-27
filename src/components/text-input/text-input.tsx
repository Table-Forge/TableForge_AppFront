import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import { DEFAULT_COLORS } from "@/src/theme/colors";
import { styles } from "./text-input.styles";

interface DefaultTextInputProps extends TextInputProps {
  type?: "location" | "text";
  hasError?: boolean;
}

export const DefaultTextInput = ({
  type = "text",
  hasError = false,
  onFocus,
  onBlur,
  ...props
}: DefaultTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputStyles = [
    styles.wrapper,
    isFocused && styles.wrapperFocused,
    hasError && styles.borderError,
  ];

  return (
    <View style={inputStyles}>
      <View
        style={[
          styles.statusMark,
          isFocused && styles.statusMarkFocused,
          hasError && styles.statusMarkError,
        ]}
      />

      {type === "location" && (
        <FontAwesome6
          name="location-dot"
          size={20}
          color={DEFAULT_COLORS.textMutedLight}
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={DEFAULT_COLORS.white_35}
        editable={type !== "location"}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
    </View>
  );
};
