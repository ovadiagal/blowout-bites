import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const AnimatedEmoji = ({
  emoji,
  offset,
}: {
  emoji: String;
  offset: number;
}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a sequence of animations with a one-time delay
    const animationSequence = Animated.sequence([
      Animated.delay(offset), // Apply the initial delay once
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: -10,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]);

    // Start the animation sequenc
    animationSequence.start();
  }, [animation, offset]);

  return (
    <Animated.View
      style={[
        styles.emoji,
        {
          transform: [{ translateY: animation }],
        },
      ]}
    >
      <Text style={styles.text}>{emoji}</Text>
    </Animated.View>
  );
};

const EmojiAnimation = () => {
  return (
    <View style={styles.container}>
      <AnimatedEmoji emoji="🍔" offset={0} />
      <AnimatedEmoji emoji="🥗" offset={400} />
      <AnimatedEmoji emoji="🍰" offset={800} />
      <AnimatedEmoji emoji="🌮" offset={1200} />
      <AnimatedEmoji emoji="🍣" offset={1600} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  emoji: {
    margin: 10,
  },
  text: {
    fontSize: 45,
  },
});

export default EmojiAnimation;
