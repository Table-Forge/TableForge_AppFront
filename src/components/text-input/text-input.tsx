import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
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
          color="rgba(255,255,255,0.7)"
          style={styles.icon}
        />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={"rgba(255,255,255,0.3)"}
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
