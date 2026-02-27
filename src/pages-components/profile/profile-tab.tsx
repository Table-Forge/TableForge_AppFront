import { InfoCard } from "@/src/components/info-card/info-card";
import { styles as infoCardStyles } from "@/src/components/info-card/info-card";
import { formatDate } from "@/src/utils/format";
import { Tag } from "@/src/components/tag/tag";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { View } from "react-native";
import { IUser } from "@/src/features/users/schemas/user.schema";

interface IProps {
  data?: IUser;
}

export const ProfileTab = ({ data }: IProps) => {
  return (
    <>
      <InfoCard title="Ficha Técnica" onEdit={() => {}}>
        <View style={infoCardStyles.cardContent}>
          <View style={infoCardStyles.cardContentItem}>
            <ThemedText style={infoCardStyles.cardContentLabel}>
              Data de Nascimento
            </ThemedText>
            <ThemedText style={infoCardStyles.cardContentValue}>
              {data?.birthDate ? formatDate(data?.birthDate) : "-"}
            </ThemedText>
          </View>
          <View style={infoCardStyles.cardContentItem}>
            <ThemedText style={infoCardStyles.cardContentLabel}>
              Gênero
            </ThemedText>
            <ThemedText style={infoCardStyles.cardContentValue}>
              {data?.gender || "-"}
            </ThemedText>
          </View>
        </View>
        <View style={infoCardStyles.cardContentItem}>
          <ThemedText style={infoCardStyles.cardContentLabel}>
            E-mail
          </ThemedText>
          <ThemedText style={infoCardStyles.cardContentValue}>
            {data?.email || "-"}
          </ThemedText>
        </View>
      </InfoCard>

      <InfoCard title="Preferências de Jogo" onEdit={() => {}}>
        <View style={infoCardStyles.cardContentItem}>
          <ThemedText style={infoCardStyles.cardContentLabel}>
            Sistema
          </ThemedText>
          <View style={infoCardStyles.cardContent}>
            <Tag text="Tormenta" />
            <Tag text="D&D" />
          </View>
        </View>
        <View style={infoCardStyles.cardContentItem}>
          <ThemedText style={infoCardStyles.cardContentLabel}>
            Classe
          </ThemedText>
          <View style={infoCardStyles.cardContent}>
            <Tag text="Clérigo" />
            <Tag text="Artífice" />
            <Tag text="Samurai" />
          </View>
        </View>
      </InfoCard>
    </>
  );
};
