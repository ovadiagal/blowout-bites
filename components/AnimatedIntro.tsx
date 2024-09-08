import React from "react";
import { StyleSheet, Text, View } from "react-native";
import EmojiAnimation from "./EmojiAnimation";

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Blowout Bites</Text>
        <Text style={styles.subtext}>Find something delicious.</Text>
      </View>
      <EmojiAnimation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff0000",
    marginBottom: 100,
  },
  text: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold", // Make the text bold
  },
  subtext: {
    fontSize: 18,
    color: "white",
    alignSelf: "flex-start",
  },
  textContainer: {
    marginBottom: 20,
  },
});

export default App;
