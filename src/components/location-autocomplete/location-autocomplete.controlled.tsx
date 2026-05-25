import {
  FieldValues,
  Path,
  UseFormReturn,
  useController,
} from "react-hook-form";

import {
  LocationAutocomplete,
  SelectedLocation,
} from "@/src/components/location-autocomplete/location-autocomplete";

interface ControlledLocationAutocompleteProps<
  TFieldValues extends FieldValues,
> {
  hasSelectionError?: boolean;
  hookForm: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  onClearSelection: () => void;
  onSelectLocation: (location: SelectedLocation) => void;
}

export function ControlledLocationAutocomplete<
  TFieldValues extends FieldValues = FieldValues,
>({
  hasSelectionError,
  hookForm,
  name,
  onClearSelection,
  onSelectLocation,
}: ControlledLocationAutocompleteProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <LocationAutocomplete
      error={error?.message}
      hasSelectionError={hasSelectionError}
      value={value?.toString() ?? ""}
      onChangeText={onChange}
      onClearSelection={onClearSelection}
      onSelectLocation={(location) => {
        onChange(location.locationName);
        onSelectLocation(location);
      }}
    />
  );
}
