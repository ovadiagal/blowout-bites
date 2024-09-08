import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Alert,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "@/FirebaseConfig";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

export default function CameraComponent() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const [text, setText] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    try {
      setUploading(true);
      const response = await fetch(image);
      const blob = await response.blob();

      const id = uuidv4();

      // Create a reference in Firebase Storage
      const storageRef = ref(FIREBASE_STORAGE, `images/${id}.jpg`);

      // Upload the image
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Upload userId and downloadURL to Firestore
      await addDoc(collection(FIREBASE_DB, "root/data/posts"), {
        userId: userId,
        postId: id,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Image uploaded successfully and data saved to Firestore!");
      setUploading(false);
      setImage(null); // Clear the image after upload
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error uploading image", JSON.stringify(error));
      setUploading(false);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Different behavior for iOS and Android
      >
        <Pressable
          onPress={pickImage}
          style={{
            display: "flex",
            margin: 30,
          }}
        >
          {image ? (
            <Image
              source={{ uri: image ?? "../assets/grey.jpg" }}
              style={styles.image}
            />
          ) : (
            <View style={styles.image}>
              <FontAwesome
                name="plus"
                size={60}
                color={"white"}
                style={{
                  alignSelf: "center",
                }}
              />
            </View>
          )}
        </Pressable>

        {image && (
          <TextInput
            style={styles.input}
            placeholder="Type something..."
            value={text}
            onChangeText={setText}
          />
        )}
        <Button
          title={uploading ? "Uploading..." : "Upload Image"}
          onPress={uploadImage}
          disabled={uploading}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    borderRadius: 20, // Rounded corners
    borderWidth: 2, // Border thickness
    borderColor: "white", // White outline color
    aspectRatio: 1, // Square aspect ratio
    display: "flex",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
