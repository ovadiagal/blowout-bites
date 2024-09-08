import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = React.useState(true);

  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    if (!user) {
      router.replace("/");
    }
  });

  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Blowout Bites",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="../pages/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="recipebook"
        options={{
          title: "Recipe Book",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="../pages/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
