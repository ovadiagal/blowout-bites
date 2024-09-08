import React, { useEffect, useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";

const LikeButton: React.FC<{ postId: string }> = ({ postId }) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const docId = `${FIREBASE_AUTH.currentUser?.uid}_${postId}`;

        if (isClicked) {
          setIsClicked(false);
          deleteDoc(doc(FIREBASE_DB, "root/data/likes", docId));
        } else {
          setIsClicked(true);
          // Specify the document ID and create the document with setDoc
          setDoc(doc(FIREBASE_DB, "root/data/likes", docId), {
            userId: FIREBASE_AUTH.currentUser?.uid,
            postId: postId,
            createdAt: serverTimestamp(),
          });
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
