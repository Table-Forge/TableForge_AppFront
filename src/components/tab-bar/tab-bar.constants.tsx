import { ReactElement } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ICONS: { [key: string]: (color: string) => ReactElement } = {
  index: (color: string): ReactElement => (
    <MaterialCommunityIcons name="home-outline" size={24} color={color} />
  ),
  messages: (color: string): ReactElement => (
    <MaterialCommunityIcons
      name="message-text-outline"
      size={20}
      color={color}
    />
  ),
  search: (color: string): ReactElement => (
    <MaterialIcons name="search" size={28} color={color} />
  ),
  notifications: (color: string): ReactElement => (
    <MaterialCommunityIcons name="bell-outline" size={20} color={color} />
  ),
  profile: (color: string): ReactElement => (
    <MaterialIcons name="person-outline" size={20} color={color} />
  ),
};

export { ICONS };
