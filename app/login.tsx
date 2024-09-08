import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "../constants/Styles";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigation, useRouter } from "expo-router";
import { Icon } from "react-native-elements/dist/icons/Icon";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ColorPalette } from "@/Colors";
import { generateRandomUsername } from "@/utils/randomUsername";

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;
  const router = useRouter();
  const navigation = useNavigation();

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      if (user) {
        if (user.user.displayName === null) {
          updateProfile(user.user, { displayName: generateRandomUsername() });
          user.user.reload();
        }
        router.dismissAll();
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        updateProfile(user.user, { displayName: generateRandomUsername() });
        user.user.reload();
        router.dismissAll();
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={1}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Text style={styles.title}>
        {type === "login" ? "Welcome back" : "Create your account"}
      </Text>

      <View style={{ marginBottom: 20 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {type === "login" ? (
        <TouchableOpacity
          onPress={signIn}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={signUp}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Create acount</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginVertical: 80,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    paddingBottom: 20,
    fontWeight: "bold",
    color: "white",
  },
  inputField: {
    color: "white",
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: ColorPalette.grey,
    borderRadius: 12,
    padding: 10,
    backgroundColor: ColorPalette.grey,
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    marginVertical: 4,
    width: "100%",
    alignSelf: "center",
  },
  btnPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Page;
