import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import { Select } from "@/src/components/select/select";
import { TOptions } from "@/src/interfaces";

interface ControlledSelectProps<TFieldValues extends FieldValues> {
  disabled?: boolean;
  hookForm: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  options: TOptions[];
  placeholder?: string;
}

export function ControlledSelect<TFieldValues extends FieldValues = FieldValues>({
  disabled,
  hookForm,
  name,
  options,
  placeholder,
}: ControlledSelectProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <Select
      disabled={disabled}
      error={error?.message}
      onSelect={onChange}
      options={options}
      placeholder={placeholder}
      value={value}
    />
  );
}
