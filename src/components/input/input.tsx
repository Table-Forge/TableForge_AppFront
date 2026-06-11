import React, { forwardRef, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SURFACES } from "@/src/theme/tokens";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useScrollToFocusedInput } from "@/src/context/scroll-to-focused-input";
import { sanitizePasswordValue } from "@/src/utils/custom-schema-validations";

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
    const wrapperRef = useRef<View>(null);
    const { scrollToFocusedInput } = useScrollToFocusedInput();

    const handleChangeText = (value: string) => {
      let sanitizedValue = value;
      if (isPassword) {
        sanitizedValue = sanitizePasswordValue(value);
      } else if (removeSpaces) {
        sanitizedValue = value.replace(/\s+/g, "");
      }
      onChangeText?.(sanitizedValue);
    };

    const showCounter =
      props.multiline === true && typeof props.maxLength === "number";
    const currentLength = String(props.value ?? "").length;

    return (
      <View ref={wrapperRef} collapsable={false} style={styles.wrapper}>
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
              disabled ? DEFAULT_COLORS.white_25 : DEFAULT_COLORS.white_35
            }
            secureTextEntry={showPassword}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            onChangeText={handleChangeText}
            onFocus={(event) => {
              setIsFocused(true);
              scrollToFocusedInput(wrapperRef);
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
                color={DEFAULT_COLORS.textMutedLight}
              />
            </TouchableOpacity>
          )}

          {disabled && isPassword && (
            <View style={styles.icon}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={DEFAULT_COLORS.white_35}
              />
            </View>
          )}

          {showCounter && (
            <Text style={styles.counter}>
              {currentLength}/{props.maxLength} caracteres
            </Text>
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
    backgroundColor: SURFACES.fill,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    borderRadius: RADII.md,
    paddingHorizontal: 16,
    height: 52,
  },
  inputFocused: {
    borderColor: BORDERS.highlightStrong,
    backgroundColor: SURFACES.fillStrong,
  },
  input: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    ...fonts.regular,
    fontSize: 15,
    height: "100%",
  },
  inputError: {
    borderColor: DEFAULT_COLORS.danger,
  },
  inputDisabled: {
    backgroundColor: DEFAULT_COLORS.white_05,
    borderColor: DEFAULT_COLORS.white_10,
    opacity: 0.75,
  },
  inputTextDisabled: {
    color: DEFAULT_COLORS.white_35,
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
    backgroundColor: DEFAULT_COLORS.purpleBorder_35,
    borderWidth: 1,
    borderColor: DEFAULT_COLORS.purpleBorder_65,
  },
  statusMarkFocused: {
    backgroundColor: DEFAULT_COLORS.purpleBright,
    borderColor: DEFAULT_COLORS.white,
  },
  statusMarkError: {
    backgroundColor: DEFAULT_COLORS.danger,
    borderColor: DEFAULT_COLORS.danger,
  },
  statusMarkDisabled: {
    backgroundColor: DEFAULT_COLORS.white_10,
    borderColor: DEFAULT_COLORS.white_08,
  },
  counter: {
    position: "absolute",
    right: 12,
    bottom: 8,
    fontSize: 11,
    color: DEFAULT_COLORS.textMuted,
    ...fonts.regular,
  },
});
