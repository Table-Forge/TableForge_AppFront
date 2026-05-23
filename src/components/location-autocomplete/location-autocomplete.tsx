import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

import { ErrorMessage } from "@/src/components/error-message/error-message";
import { Input } from "@/src/components/input/input";
import { Label } from "@/src/components/label/label";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const LOCATION_SUGGESTIONS_RADIUS_METERS = 50000;

export type SelectedLocation = {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
};

type GeoapifyLocationSuggestion = {
  place_id: string;
  name?: string;
  formatted: string;
  address_line1?: string;
  address_line2?: string;
  lat: number;
  lon: number;
  distance?: number;
};

type UserCoordinates = {
  latitude: number;
  longitude: number;
};

interface LocationAutocompleteProps {
  error?: string;
  hasSelectionError?: boolean;
  onChangeText: (value: string) => void;
  onClearSelection: () => void;
  onFocus?: () => void;
  onSelectLocation: (location: SelectedLocation) => void;
  value: string;
}

export function LocationAutocomplete({
  error,
  hasSelectionError = false,
  onChangeText,
  onClearSelection,
  onFocus,
  onSelectLocation,
  value,
}: LocationAutocompleteProps) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifyLocationSuggestion[]>(
    [],
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates>();

  useEffect(() => {
    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) return;

      const currentLocation = await Location.getCurrentPositionAsync({});

      setUserCoordinates({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (trimmedSearch.length < 2 || !GEOAPIFY_API_KEY || !userCoordinates) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);

      try {
        const locationFilter = `circle:${userCoordinates.longitude},${userCoordinates.latitude},${LOCATION_SUGGESTIONS_RADIUS_METERS}`;
        const locationBias = `proximity:${userCoordinates.longitude},${userCoordinates.latitude}`;
        const autocompleteParams = new URLSearchParams({
          text: trimmedSearch,
          format: "json",
          limit: "5",
          lang: "pt",
          apiKey: GEOAPIFY_API_KEY,
          filter: locationFilter,
          bias: locationBias,
        });
        const autocompleteResponse = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${autocompleteParams.toString()}`,
          { signal: abortController.signal },
        );

        if (!autocompleteResponse.ok) {
          throw new Error("Falha na busca de localização.");
        }

        const autocompleteData = (await autocompleteResponse.json()) as {
          results?: GeoapifyLocationSuggestion[];
        };
        const sortedSuggestions = (autocompleteData.results ?? [])
          .map((suggestion) => ({
            ...suggestion,
            distance:
              suggestion.distance ??
              calculateDistanceInMeters(userCoordinates, {
                latitude: suggestion.lat,
                longitude: suggestion.lon,
              }),
          }))
          .filter(
            (suggestion) =>
              typeof suggestion.distance === "number" &&
              suggestion.distance <= LOCATION_SUGGESTIONS_RADIUS_METERS,
          )
          .sort((first, second) => first.distance - second.distance);

        setSuggestions(
          Array.from(
            new Map(
              sortedSuggestions.map((suggestion) => [
                suggestion.place_id,
                suggestion,
              ]),
            ).values(),
          ).slice(0, 5),
        );
      } catch {
        if (abortController.signal.aborted) return;

        setSuggestions([]);
        Toast.show({
          type: "error",
          text1: "Falha na busca",
          text2: "Não foi possível buscar sugestões de localização.",
        });
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [search, userCoordinates]);

  const handleChangeText = (text: string) => {
    onChangeText(text);
    setSearch(text);
    onClearSelection();
  };

  const handleSelectSuggestion = (suggestion: GeoapifyLocationSuggestion) => {
    const locationName =
      suggestion.name || suggestion.address_line1 || suggestion.formatted;

    onChangeText(locationName);
    setSearch(locationName);
    setSuggestions([]);
    onSelectLocation({
      locationName,
      address: suggestion.formatted,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
  };

  return (
    <View style={styles.container}>
      <Label text="Localização" />
      <Input
        placeholder="Digite o nome ou endereço do local"
        value={value}
        onChangeText={handleChangeText}
        onFocus={onFocus}
      />

      {isLoadingSuggestions && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={DEFAULT_COLORS.secondary} />
        </View>
      )}

      {suggestions.length > 0 && (
        <View style={styles.list}>
          {suggestions.map((suggestion) => (
            <LocationSuggestionItem
              key={suggestion.place_id}
              suggestion={suggestion}
              distance={suggestion.distance}
              onPress={() => handleSelectSuggestion(suggestion)}
            />
          ))}
        </View>
      )}

      {!GEOAPIFY_API_KEY && (
        <ErrorMessage text="Configure a chave do Geoapify para buscar localizações." />
      )}
      {error && <ErrorMessage text={error} />}
      {hasSelectionError && (
        <ErrorMessage text="Selecione uma sugestão de localização válida." />
      )}
    </View>
  );
}

function LocationSuggestionItem({
  suggestion,
  distance,
  onPress,
}: {
  suggestion: GeoapifyLocationSuggestion;
  distance?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.listRow,
        pressed && styles.listRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.listRowHeader}>
        <ThemedText weight="bold" style={styles.listTitle}>
          {suggestion.name || suggestion.address_line1 || suggestion.formatted}
        </ThemedText>
        {typeof distance === "number" && (
          <ThemedText weight="bold" style={styles.distance}>
            {formatDistance(distance)}
          </ThemedText>
        )}
      </View>
      {suggestion.address_line2 && (
        <ThemedText style={styles.listDescription}>
          {suggestion.address_line2}
        </ThemedText>
      )}
    </Pressable>
  );
}

function calculateDistanceInMeters(
  origin: UserCoordinates,
  destination: UserCoordinates,
) {
  const earthRadiusInMeters = 6371000;
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    earthRadiusInMeters *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function formatDistance(distanceInMeters: number) {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  return `${(distanceInMeters / 1000).toFixed(1).replace(".", ",")} km`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loading: {
    marginTop: 8,
    alignItems: "center",
  },
  list: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: DEFAULT_COLORS.primary,
    borderWidth: 1,
    borderColor: "rgba(126, 135, 226, 0.2)",
    overflow: "hidden",
  },
  listRow: {
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    gap: 4,
  },
  listRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listRowPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  listTitle: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    fontSize: 14,
  },
  listDescription: {
    color: DEFAULT_COLORS.grays._200,
    fontSize: 12,
  },
  distance: {
    color: DEFAULT_COLORS.secondary,
    fontSize: 12,
  },
});
