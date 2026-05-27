import { InfoCard } from "@/src/components/info-card/info-card";
import { styles as infoCardStyles } from "@/src/components/info-card/info-card";
import { Tag } from "@/src/components/tag/tag";
import { ThemedText } from "@/src/components/themed-text/themed-text";
import { View } from "react-native";
import { IUser } from "@/src/features/users/schemas/user.schema";

interface IProps {
  data?: IUser;
  editable?: boolean;
}

export const ProfileTab = ({ editable = false }: IProps) => {
  return (
    <>
      <InfoCard
        title="Preferências de Jogo"
        onEdit={editable ? () => {} : undefined}
      >
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
