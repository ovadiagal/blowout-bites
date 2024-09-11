import { StatusBar } from "expo-status-bar";
import { Button, Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 30,
    gap: 10,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
