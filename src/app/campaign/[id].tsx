import { BackButton } from "@/src/components/back-button/back-blob";
import { MainContainer } from "@/src/components/main-container/main-container";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { campaignList } from "@/src/data/mock";
import { ICampaign } from "@/src/interfaces";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Campaign() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ICampaign | undefined>(undefined);

  const fetchData = () => {
    setLoading(true);
    try {
      const response = campaignList.find((item) => item.id === Number(id));
      setData(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) return <Text>Loading...</Text>;
  return (
    <MainContainer>
      <BackButton />

      <View>
        <ThemedText>{data?.title}</ThemedText>
      </View>
    </MainContainer>
  );
}
