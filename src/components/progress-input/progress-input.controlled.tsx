import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import { ProgressInput } from "@/src/components/progress-input/progress-input";

interface ControlledProgressInputProps<TFieldValues extends FieldValues> {
  hookForm: UseFormReturn<TFieldValues>;
  max: number;
  min: number;
  name: Path<TFieldValues>;
}

export function ControlledProgressInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  hookForm,
  max,
  min,
  name,
}: ControlledProgressInputProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <ProgressInput
      error={error?.message}
      max={max}
      min={min}
      onChange={onChange}
      value={Number(value) || min}
    />
  );
}
