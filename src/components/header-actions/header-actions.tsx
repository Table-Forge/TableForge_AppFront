import { styles } from "@/src/components/header-actions/header-actions.styles";
import { View, ViewStyle } from "react-native";

interface IProps {
  children?: React.ReactNode;
  position?: "full" | "left" | "right";
  hasPadding?: boolean;
  gap?: number;
}

export const HeaderActions = ({
  children,
  position = "full",
  hasPadding = true,
  gap = 10,
}: IProps) => {
  const alignmentMap: Record<string, ViewStyle["justifyContent"]> = {
    full: "space-between",
    left: "flex-start",
    right: "flex-end",
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          justifyContent: alignmentMap[position],
          gap: gap,
          paddingHorizontal: hasPadding ? 16 : 0,
        },
      ]}
    >
      {children}
    </View>
  );
};
