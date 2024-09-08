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
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "@/FirebaseConfig";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import { generateRandomUsername } from "@/utils/randomUsername";

export default function ModalScreen() {
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
        userScreenName:
          FIREBASE_AUTH.currentUser?.displayName ?? generateRandomUsername(),
        postId: id,
        imageUrl: downloadURL,
        caption: text,
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
    <KeyboardAvoidingView
      id="meow"
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingVertical: 20,
        }}
      >
        <Pressable
          onPress={pickImage}
          style={{
            display: "flex",
            marginHorizontal: 20,
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

        <TextInput
          style={styles.input}
          placeholder="Give your blowout a name..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          onPress={uploadImage}
          disabled={uploading}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Upload Blowout</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: "80%",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
  },
  input: {
    alignSelf: "center",
    height: 40,
    width: "75%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    marginVertical: 4,
    width: "75%",
    alignSelf: "center",
  },
  btnPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
