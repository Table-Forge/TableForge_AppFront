import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import {
  ImageInputValue,
  InputImage,
  type ImageInputProps,
} from "@/src/components/input/input.image";

type ImageInputValueMode = "content" | "image" | "uri";

interface ControlledImageInputProps<TFieldValues extends FieldValues>
  extends Omit<ImageInputProps, "error" | "onChange" | "value"> {
  error?: string;
  hookForm: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  onImageChange?: (image: ImageInputValue) => void;
  previewValue?: string;
  valueMode?: ImageInputValueMode;
}

export function ControlledImageInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  error,
  hookForm,
  name,
  onImageChange,
  previewValue,
  valueMode = "image",
  ...props
}: ControlledImageInputProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control: hookForm.control,
  });

  const resolvedValue =
    typeof value === "string"
      ? value
      : isImageInputValue(value)
        ? value.uri
        : previewValue;

  return (
    <InputImage
      {...props}
      error={error ?? fieldError?.message}
      value={resolvedValue}
      onChange={(image) => {
        onImageChange?.(image);

        if (valueMode === "content") {
          onChange(image.content);
          return;
        }

        if (valueMode === "uri") {
          onChange(image.uri);
          return;
        }

        onChange(image);
      }}
    />
  );
}

function isImageInputValue(value: unknown): value is ImageInputValue {
  return (
    !!value &&
    typeof value === "object" &&
    "uri" in value &&
    typeof (value as ImageInputValue).uri === "string"
  );
}
