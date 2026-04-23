import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { ErrorMessage } from "@/src/components/error-message/error-message";

interface InputProps extends TextInputProps {
  error?: string;
  isPassword?: boolean;
  disabled?: boolean;
  removeSpaces?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { error, isPassword, style, disabled, removeSpaces = false, onChangeText, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(isPassword);

    const handleChangeText = (value: string) => {
      const sanitizedValue = removeSpaces ? value.replace(/\s+/g, "") : value;
      onChangeText?.(sanitizedValue);
    };

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.inputContainer,
            error ? styles.inputError : null,
            disabled && styles.inputDisabled,
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, style, disabled && styles.inputTextDisabled]}
            placeholderTextColor={
              disabled ? "rgba(153, 153, 153, 0.4)" : "#999"
            }
            secureTextEntry={showPassword}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            onChangeText={handleChangeText}
            {...props}
          />

          {isPassword && !disabled && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={DEFAULT_COLORS.white}
              />
            </TouchableOpacity>
          )}

          {disabled && isPassword && (
            <View style={styles.icon}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="rgba(255,255,255,0.3)"
              />
            </View>
          )}
        </View>

        {error && <ErrorMessage text={error} />}
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    ...fonts.regular,
    fontSize: 16,
    height: "100%",
  },
  inputError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  inputDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    opacity: 0.7,
  },
  inputTextDisabled: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  icon: {
    marginLeft: 10,
  },
});
