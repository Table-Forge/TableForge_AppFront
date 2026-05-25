import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";
import { TextInputProps } from "react-native";

import { Input } from "@/src/components/input/input";

interface ControlledInputProps<TFieldValues extends FieldValues>
  extends Omit<TextInputProps, "onBlur" | "onChange" | "onChangeText" | "value"> {
  containerStyle?: React.ComponentProps<typeof Input>["containerStyle"];
  disabled?: boolean;
  hookForm: UseFormReturn<TFieldValues>;
  isPassword?: boolean;
  name: Path<TFieldValues>;
  removeSpaces?: boolean;
}

export function ControlledInput<TFieldValues extends FieldValues = FieldValues>({
  hookForm,
  name,
  ...props
}: ControlledInputProps<TFieldValues>) {
  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <Input
      {...props}
      value={value?.toString() ?? ""}
      onBlur={onBlur}
      onChangeText={onChange}
      error={error?.message}
    />
  );
}
