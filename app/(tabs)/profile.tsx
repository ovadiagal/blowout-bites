import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import CameraComponent from "@/components/CameraComponent";
import ProfileFeed from "@/components/feeds/ProfileFeed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "flex-start",
          padding: 20,
        }}
      >
        <Text style={styles.title}>
          @{FIREBASE_AUTH.currentUser?.displayName}
        </Text>
      </View>

      <ProfileFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
