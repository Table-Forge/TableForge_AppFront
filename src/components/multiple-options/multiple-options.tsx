import { useController } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./multiple-options.styles";
import { TOptions, TPrimitives } from "@/src/interfaces";

interface RadioOptionsProps {
  hookform: any;
  name: string;
  options: TOptions[];
  hasError?: boolean;
}

export const RadioOptions = ({
  hookform,
  name,
  options,
  hasError,
}: RadioOptionsProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control: hookform.control,
  });

  const handlePress = (optionValue?: TPrimitives) => {
    const currentValue = Array.isArray(value) ? value : [];

    if (currentValue.includes(optionValue)) {
      onChange(currentValue.filter((v) => v !== optionValue));
    } else {
      onChange([...currentValue, optionValue]);
    }
  };

  return (
    <View style={styles.wrapper}>
      {options.map((option) => {
        const isSelected = Array.isArray(value) && value.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value?.toString()}
            onPress={() => handlePress(option.value)}
            style={[
              styles.option,
              isSelected && styles.optionSelected,
              hasError && styles.optionError,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
