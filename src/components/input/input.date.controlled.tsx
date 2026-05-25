import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import { DateInput } from "@/src/components/input/input.date";

interface ControlledDateInputProps<TFieldValues extends FieldValues> {
  hookForm: UseFormReturn<TFieldValues>;
  infoText?: string;
  label: string;
  maxDate?: Date;
  minDate?: Date;
  name: Path<TFieldValues>;
  placeholder?: string;
}

export function ControlledDateInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  hookForm,
  infoText,
  label,
  maxDate,
  minDate,
  name,
  placeholder,
}: ControlledDateInputProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <DateInput
      error={error?.message}
      infoText={infoText}
      label={label}
      maxDate={maxDate}
      minDate={minDate}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
}
