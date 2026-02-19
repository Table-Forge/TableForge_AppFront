import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { mainContainerStyles } from "@/src/components/main-container/main-container.styles";
import { NotificationButton } from "@/src/components/notification-button/notification-button";
import { SearchBar } from "@/src/components/search-bar/search-bar";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { campaignList } from "@/src/data/mock";
import { useLocation } from "@/src/hooks/useLocation";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const colors = DEFAULT_COLORS;

export default function Search() {
  //adicionar update ao puxar pra baixo pra baixo, com loading

  const { location, loading } = useLocation();
  const locationString = `${location?.city || ""}${
    location?.city && location?.region ? ", " : ""
  }${location?.region || ""}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={mainContainerStyles.container}>
        <View style={styles.topWrapper}>
          <View style={styles.locationWrapper}>
            <ThemedText style={{ fontSize: 14 }}>Localização</ThemedText>
            <View style={styles.locationText}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <FontAwesome6
                    name="location-dot"
                    color={colors.secondary}
                    size={16}
                  />
                  <ThemedText style={{ fontSize: 16 }} weight="bold">
                    {locationString}
                  </ThemedText>
                </>
              )}
            </View>
          </View>
          <NotificationButton />
        </View>

        <SearchBar />

        <FlatList
          style={styles.campaignList}
          data={campaignList}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => <CampaignItem key={item.id} data={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  topWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  locationWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  locationText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  campaignList: {
    borderRadius: 8,
    width: "100%",
  },
});
