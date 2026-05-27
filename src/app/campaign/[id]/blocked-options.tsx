import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { ActionButton } from "@/src/components/action-button/action-button";
import { Button } from "@/src/components/button/button";
import { HeaderActions } from "@/src/components/header-actions/header-actions";
import { Screen } from "@/src/components/screen/screen";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { useCampaignBlockedClasses } from "@/src/features/campaign-blocked-classes/hooks/use-campaign-blocked-classes";
import { useCampaignBlockedClassesMutation } from "@/src/features/campaign-blocked-classes/hooks/use-campaign-blocked-classes-mutations";
import { useCampaignBlockedRaces } from "@/src/features/campaign-blocked-races/hooks/use-campaign-blocked-races";
import { useCampaignBlockedRacesMutation } from "@/src/features/campaign-blocked-races/hooks/use-campaign-blocked-races-mutations";
import { useClassesSelect } from "@/src/features/classes/hooks/use-classes-select";
import { useRacesSelect } from "@/src/features/races/hooks/use-races-select";
import { useBackRouter } from "@/src/hooks/use-back-route";
import { TOptions } from "@/src/interfaces";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";

type BlockedOptionsType = "classes" | "races";

export default function CampaignBlockedOptionsScreen() {
  const { handleBack } = useBackRouter();
  const { id, type } = useLocalSearchParams();
  const campaignId = Number(id);
  const blockedOptionsType: BlockedOptionsType =
    type === "races" ? "races" : "classes";
  const {
    data: blockedClasses = [],
    isLoading: isLoadingBlockedClasses,
  } = useCampaignBlockedClasses({
    campaignId,
    enabled: blockedOptionsType === "classes",
  });
  const { data: blockedRaces = [], isLoading: isLoadingBlockedRaces } =
    useCampaignBlockedRaces({
      campaignId,
      enabled: blockedOptionsType === "races",
    });
  const {
    createCampaignBlockedClassesMutation,
    deleteCampaignBlockedClassMutation,
    isCreatingCampaignBlockedClasses,
    isDeletingCampaignBlockedClass,
  } = useCampaignBlockedClassesMutation(campaignId);
  const {
    createCampaignBlockedRacesMutation,
    deleteCampaignBlockedRaceMutation,
    isCreatingCampaignBlockedRaces,
    isDeletingCampaignBlockedRace,
  } = useCampaignBlockedRacesMutation(campaignId);
  const { classOptions, isLoadingClassesSelect } = useClassesSelect({
    enabled: blockedOptionsType === "classes",
  });
  const { raceOptions, isLoadingRacesSelect } = useRacesSelect({
    enabled: blockedOptionsType === "races",
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const options = useMemo<TOptions[]>(
    () => (blockedOptionsType === "classes" ? classOptions : raceOptions),
    [blockedOptionsType, classOptions, raceOptions],
  );
  const title =
    blockedOptionsType === "classes"
      ? "Classes bloqueadas"
      : "Raças bloqueadas";
  const isLoading =
    (blockedOptionsType === "classes"
      ? isLoadingBlockedClasses
      : isLoadingBlockedRaces) ||
    (blockedOptionsType === "classes"
      ? isLoadingClassesSelect
      : isLoadingRacesSelect);
  const isSaving =
    isCreatingCampaignBlockedClasses ||
    isDeletingCampaignBlockedClass ||
    isCreatingCampaignBlockedRaces ||
    isDeletingCampaignBlockedRace;

  useEffect(() => {
    setSelectedIds(
      blockedOptionsType === "classes"
        ? blockedClasses.map((item) => item.classId)
        : blockedRaces.map((item) => item.raceId),
    );
  }, [blockedClasses, blockedOptionsType, blockedRaces]);

  const handleToggleOption = (optionId: number) => {
    setSelectedIds((currentSelectedIds) =>
      currentSelectedIds.includes(optionId)
        ? currentSelectedIds.filter((id) => id !== optionId)
        : [...currentSelectedIds, optionId],
    );
  };

  const handleSubmit = async () => {
    if (!campaignId) return;

    if (blockedOptionsType === "classes") {
      const blockedClassIds = blockedClasses.map((item) => item.classId);
      const classIdsToCreate = selectedIds.filter(
        (classId) => !blockedClassIds.includes(classId),
      );
      const blockedClassesToDelete = blockedClasses.filter(
        (item) => !selectedIds.includes(item.classId),
      );

      await Promise.all([
        ...blockedClassesToDelete.map((item) =>
          deleteCampaignBlockedClassMutation.mutateAsync(item.id),
        ),
        classIdsToCreate.length
          ? createCampaignBlockedClassesMutation.mutateAsync({
              campaignId,
              classIds: classIdsToCreate,
            })
          : Promise.resolve(),
      ]);
    } else {
      const blockedRaceIds = blockedRaces.map((item) => item.raceId);
      const raceIdsToCreate = selectedIds.filter(
        (raceId) => !blockedRaceIds.includes(raceId),
      );
      const blockedRacesToDelete = blockedRaces.filter(
        (item) => !selectedIds.includes(item.raceId),
      );

      await Promise.all([
        ...blockedRacesToDelete.map((item) =>
          deleteCampaignBlockedRaceMutation.mutateAsync(item.id),
        ),
        raceIdsToCreate.length
          ? createCampaignBlockedRacesMutation.mutateAsync({
              campaignId,
              raceIds: raceIdsToCreate,
            })
          : Promise.resolve(),
      ]);
    }

    handleBack();
  };

  return (
    <Screen style={styles.container}>
      <Screen.Header>
        <HeaderActions>
          <ActionButton
            variant="circle"
            icon={
              <Ionicons
                name="arrow-back"
                size={22}
                color={DEFAULT_COLORS.white}
              />
            }
            onPress={handleBack}
          />
          <ThemedText weight="bold" style={styles.headerTitle}>
            {title}
          </ThemedText>
          <View style={styles.headerSpacer} />
        </HeaderActions>
      </Screen.Header>

      <Screen.Body scroll contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color={DEFAULT_COLORS.purpleBright} />
            <ThemedText style={styles.emptyText}>Carregando...</ThemedText>
          </View>
        ) : (
          <View style={styles.optionsCard}>
            {options.map((option, index) => {
              const optionId = Number(option.value);
              const isSelected = selectedIds.includes(optionId);
              const isLast = index === options.length - 1;

              return (
                <Pressable
                  key={String(option.value)}
                  style={[
                    styles.optionItem,
                    isLast && styles.optionItemLast,
                    isSelected && styles.optionItemSelected,
                  ]}
                  onPress={() => handleToggleOption(optionId)}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.name}
                  </ThemedText>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <FontAwesome5
                        name="check"
                        size={11}
                        color={DEFAULT_COLORS.white}
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </Screen.Body>

      <Screen.Footer>
        <Button
          variant="tertiary"
          text="Salvar bloqueios"
          onPress={handleSubmit}
          disabled={isLoading || isSaving}
          isLoading={isSaving}
        />
      </Screen.Footer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACES.background,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: DEFAULT_COLORS.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    padding: 20,
  },
  loadingWrapper: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 32,
  },
  emptyText: {
    color: DEFAULT_COLORS.textMuted,
  },
  optionsCard: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    backgroundColor: SURFACES.card,
    overflow: "hidden",
    ...SHADOWS.soft,
  },
  optionItem: {
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDERS.divider,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionItemSelected: {
    backgroundColor: DEFAULT_COLORS.orangeGlow_07,
  },
  optionText: {
    flex: 1,
    color: DEFAULT_COLORS.white,
    fontSize: 15,
    ...fonts.regular,
  },
  optionTextSelected: {
    color: DEFAULT_COLORS.white,
    ...fonts.bold,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DEFAULT_COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },
});
