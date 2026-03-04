import { View, ViewStyle, StyleSheet } from "react-native";

interface IProps {
  children?: React.ReactNode;
  position?: "full" | "left" | "right";
  hasPadding?: boolean;
  padding?: number;
  gap?: number;
}

export const HeaderActions = ({
  children,
  position = "full",
  hasPadding = true,
  padding,
  gap = 10,
}: IProps) => {
  const alignmentMap: Record<string, ViewStyle["justifyContent"]> = {
    full: "space-between",
    left: "flex-start",
    right: "flex-end",
  };

  const dynamicStyles: ViewStyle = {
    justifyContent: alignmentMap[position],
    gap,
    ...(padding !== undefined
      ? { padding }
      : { paddingHorizontal: hasPadding ? 16 : 0 }),
  };

  return <View style={[styles.wrapper, dynamicStyles]}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
});
