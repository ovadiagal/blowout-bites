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
          flexDirection: "row",
          display: "flex",
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    backgroundColor: "black",
    flexGrow: 1,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
