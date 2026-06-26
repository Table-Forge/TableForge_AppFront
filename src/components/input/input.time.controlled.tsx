import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import { TimeInput } from "@/src/components/input/input.time";

interface ControlledTimeInputProps<TFieldValues extends FieldValues> {
  hookForm: UseFormReturn<TFieldValues>;
  infoText?: string;
  label: string;
  name: Path<TFieldValues>;
  placeholder?: string;
}

export function ControlledTimeInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  hookForm,
  infoText,
  label,
  name,
  placeholder,
}: ControlledTimeInputProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <TimeInput
      error={error?.message}
      infoText={infoText}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
}
