import { DEFAULT_COLORS } from "@/src/theme/colors";
import Slider from "@react-native-community/slider";
import { useController } from "react-hook-form";
import { Text, View } from "react-native";
import { styles } from "./progress-input.styles";

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
};
