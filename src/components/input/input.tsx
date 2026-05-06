import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
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
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      error,
      isPassword,
      style,
      disabled,
      removeSpaces = false,
      onChangeText,
      containerStyle,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);

    const handleChangeText = (value: string) => {
      const sanitizedValue = removeSpaces ? value.replace(/\s+/g, "") : value;
      onChangeText?.(sanitizedValue);
    };

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputFocused,
            error ? styles.inputError : null,
            disabled && styles.inputDisabled,
            containerStyle,
          ]}
        >
          <View
            style={[
              styles.statusMark,
              isFocused && styles.statusMarkFocused,
              error && styles.statusMarkError,
              disabled && styles.statusMarkDisabled,
            ]}
          />

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
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.45)",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 52,
    shadowColor: DEFAULT_COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  inputFocused: {
    borderColor: DEFAULT_COLORS.tertiary,
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    shadowColor: DEFAULT_COLORS.tertiary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
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
  statusMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    alignSelf: "center",
    backgroundColor: "rgba(126, 135, 226, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  statusMarkFocused: {
    backgroundColor: DEFAULT_COLORS.tertiary,
    borderColor: DEFAULT_COLORS.white,
  },
  statusMarkError: {
    backgroundColor: DEFAULT_COLORS.danger,
    borderColor: DEFAULT_COLORS.danger,
  },
  statusMarkDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
});
