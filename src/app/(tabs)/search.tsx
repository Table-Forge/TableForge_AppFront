import { CampaignItem } from "@/src/components/campaign-item/campaign-item";
import { MainContainer } from "@/src/components/main-container/main-container";
import { NotificationButton } from "@/src/components/notification-button/notification-button";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { campaignList } from "@/src/data/mock";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { StyleSheet, View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const colors = DEFAULT_COLORS;

export default function Search() {
  //adicionar update ao puxar pra baixo pra baixo, com loading

  return (
    <MainContainer>
      <View style={styles.topWrapper}>
        <View style={styles.locationWrapper}>
          <ThemedText style={{ fontSize: 14 }}>Localização</ThemedText>
          <View style={styles.locationText}>
            <FontAwesome6 name="location-dot" color={colors.secondary} />
            <ThemedText style={{ fontSize: 16 }} weight="bold">
              Londrina, PR
            </ThemedText>
          </View>
        </View>
        <NotificationButton />
      </View>

      <View style={styles.campaignList}>
        {campaignList.map((campaign) => (
          <CampaignItem key={campaign.id} data={campaign} />
        ))}
      </View>
    </MainContainer>
  );
}

export const styles = StyleSheet.create({
  topWrapper: {
    flex: 1,
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
    flex: 1,
    gap: 10,
  },
});
