import React, { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

const LikeButton: React.FC<{ postId: string }> = ({ postId }) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (isClicked) {
          setIsClicked(false);

        } else {
          setIsClicked(true);
        }
      }}
    >
      <Text
        style={{
          opacity: isClicked ? 1 : 0.2,
          fontSize: 38,
        }}
      >
        🔥
      </Text>
    </Pressable>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: "black",
  },
});

export default LikeButton;
