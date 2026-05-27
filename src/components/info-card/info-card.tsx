import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { BORDERS, RADII, SHADOWS, SURFACES } from "@/src/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface IProps {
  title?: string;
  children: React.ReactNode;
  onEdit?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InfoCard = ({ title, children, onEdit, style }: IProps) => (
  <View style={[styles.card, style]}>
    {(title || onEdit) && (
      <View style={styles.cardHeader}>
        {title && <ThemedText style={styles.cardTitle}>{title}</ThemedText>}
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Ionicons
              name="pencil"
              size={18}
              color={DEFAULT_COLORS.purpleBright}
            />
          </TouchableOpacity>
        )}
      </View>
    )}
    {children}
  </View>
);

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: SURFACES.card,
    borderRadius: RADII.lg,
    padding: 18,
    marginBottom: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: BORDERS.highlight,
    ...SHADOWS.soft,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    ...fonts.bold,
    color: DEFAULT_COLORS.purpleBright,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  cardContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 8,
  },
  cardContentItem: {
    flexDirection: "column",
    gap: 4,
  },
  cardContentLabel: {
    ...fonts.regular,
    fontSize: 11,
    color: DEFAULT_COLORS.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardContentValue: {
    ...fonts.bold,
    fontSize: 16,
    color: DEFAULT_COLORS.white,
  },
  cardList: {
    display: "flex",
    gap: 10,
  },
  cardItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    width: "100%",
  },
});
