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
          backgroundColor: "#121212",
        }}
      >
        <Text style={styles.title}>
          @{FIREBASE_AUTH.currentUser?.displayName}
        </Text>
        <Text style={{ color: "white" }}>
          Joined on:{" "}
          {FIREBASE_AUTH.currentUser?.metadata.creationTime &&
            new Date(
              FIREBASE_AUTH.currentUser.metadata.creationTime
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
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
    color: "white",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
