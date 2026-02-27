import Slider from "@react-native-community/slider";
import { useController } from "react-hook-form";
import { Text, View } from "react-native";


import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet } from "react-native";
import { fonts } from "@/src/theme/fonts";

interface ProgressInputProps {
  hookform: any;
  name: string;
  min: number;
  max: number;
}

export const ProgressInput = ({
  hookform,
  name,
  min,
  max,
}: ProgressInputProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control: hookform.control,
    defaultValue: min,
  });

  return (
    <View style={styles.wrapper}>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={DEFAULT_COLORS.secondary}
        maximumTrackTintColor={"#454572"}
        thumbTintColor={DEFAULT_COLORS.white}
        step={1}
      />
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}
export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  valueText: {
    marginTop: 10,
    fontSize: 18,
    ...fonts.bold,
    color: DEFAULT_COLORS.white,
  },
});
