import { ThemedText } from "@/src/components/themed-text/themed-text";
import { DEFAULT_COLORS } from "@/src/theme/colors";
import { fonts } from "@/src/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
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
            <Ionicons name="pencil" size={18} color={DEFAULT_COLORS.white} />
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
    backgroundColor: DEFAULT_COLORS.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    gap: 8,

    borderWidth: 0.5,
    borderColor: DEFAULT_COLORS.tertiary,

    shadowColor: DEFAULT_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    ...fonts.bold,
    color: DEFAULT_COLORS.tertiary,
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row",
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
    fontSize: 12,
    color: DEFAULT_COLORS.white,
    opacity: 0.5,
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
    gap: 8,
    alignItems: "flex-start",
    width: "100%",
  },
});
