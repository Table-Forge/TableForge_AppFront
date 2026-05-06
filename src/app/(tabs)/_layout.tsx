import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { TabBar } from "@/src/components/tab-bar/tab-bar";

const MaterialTabs = withLayoutContext(
  createMaterialTopTabNavigator().Navigator,
);

export default function TabsLayout() {
  return (
    <MaterialTabs
      initialRouteName="campaigns"
      tabBarPosition="bottom"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
      }}
    >
      <MaterialTabs.Screen name="index" />
      <MaterialTabs.Screen name="messages" />
      <MaterialTabs.Screen name="campaigns" />
      <MaterialTabs.Screen name="notifications" />
      <MaterialTabs.Screen name="profile" />
    </MaterialTabs>
  );
}
