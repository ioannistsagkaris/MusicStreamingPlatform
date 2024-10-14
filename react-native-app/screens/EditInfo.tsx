import {
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  StatusBar,
  Alert,
} from "react-native";
import { View, Text } from "../components/Theme";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLayoutEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { useSong } from "../SongContext";

export default function EditInfo({route}: any) {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? "black" : "white";
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";
  const styles = getStyles(colorScheme);
  const [textEmail, setTextEmail] = useState("");
  const [textUsername, setTextUsername] = useState("");
  const [textPassword, setTextPassword] = useState("");
  const { onUpdate, onDelete, loadingState } = useAuth();
  const { onStop } = useSong();
  const { email, username } = route.params;

  const handleUpdate = async () => {
    if (textEmail === "" && textUsername === "" && textPassword === "") {
      Alert.alert("Failed to update info:", "Nothing to update!", [
        { text: "OK", onPress: () => navigation.navigate("Edit Info", {email: email, username: username}) },
      ]);
    } else {
      const token = (await AsyncStorage.getItem("accessToken")) || "";

      const response = await onUpdate!(
        textEmail,
        textUsername,
        textPassword,
        token,
      );

      if (response.statusCode === 400) {
        const errorResponse = await response.message;
        if (errorResponse) {
          if (
            errorResponse[0].includes("Email") ||
            errorResponse[0].includes("email")
          ) {
            Alert.alert("Failed to update info:", errorResponse[0], [
              { text: "OK", onPress: () => navigation.navigate("Edit Info", {email: email, username: username}) },
            ]);
          } else if (
            errorResponse[0].includes("Password") ||
            errorResponse[0].includes("password")
          ) {
            Alert.alert("Failed to update info:", errorResponse[0], [
              { text: "OK", onPress: () => navigation.navigate("Edit Info", {email: email, username: username}) },
            ]);
          }
        } else {
          throw new Error("Error updating user");
        }
      } else {
        navigation.goBack();
      }
    }
  };

  const handleDelete = async () => {
    try {
      await onStop!();

      const token = (await AsyncStorage.getItem("accessToken")) || "";
      const response = await onDelete!(token);

      if (response.data != undefined) {
        Alert.alert("Status:", response.data.message, [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.5}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#19bfb7" />
            <Text style={{ fontSize: 20, color: "#19bfb7" }}> Back</Text>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleUpdate} activeOpacity={0.5}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ fontSize: 20, color: "#19bfb7" }}>Done </Text>
            <MaterialIcons name="done" size={24} color="#19bfb7" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleUpdate]);

  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Spinner visible={loadingState?.isLoading} />
          <Text style={styles.text}> Email </Text>
          <View style={styles.gap} />
          <TextInput
            style={styles.textInput}
            placeholder={email}
            placeholderTextColor="gray"
            onChangeText={(newText) => {
              setTextEmail(newText);
            }}
            defaultValue={textEmail}
          />
          <View style={styles.space} />
          <Text style={styles.text}> Username </Text>
          <View style={styles.gap} />
          <TextInput
            style={styles.textInput}
            placeholder={username}
            placeholderTextColor="gray"
            onChangeText={(newText) => setTextUsername(newText)}
            defaultValue={textUsername}
          />
          <View style={styles.space} />
          <Text style={styles.text}> Password </Text>
          <View style={styles.gap} />
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="••••••••"
            placeholderTextColor="gray"
            onChangeText={(newText) => {
              setTextPassword(newText);
            }}
            defaultValue={textPassword}
          />
          <View style={styles.space} />
          <View style={styles.buttonContainer}></View>
          <View style={{ marginTop: -20 }}>
            <Text style={{ fontSize: 11 }}>
              *Input the information you wish to update and leave blank any
              field or fields you don't want to alter.
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text style={{ fontSize: 11 }}>
                *If you wish to delete your account press
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "You are about to delete your account:",
                    "Are you sure?",
                    [
                      {
                        text: "Yes",
                        onPress: () => handleDelete(),
                      },
                      {
                        text: "No",
                        onPress: () => navigation.navigate("Edit Info", {email: email, username: username}),
                      },
                    ],
                  );
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12, color: "#19bfb7" }}> here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const getStyles = (colorScheme: string | null | undefined) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 25,
    },
    space: {
      height: 55,
    },
    textInput: {
      height: 45,
      borderWidth: 1,
      borderColor: "#19bfb7",
      borderRadius: 25,
      marginTop: 5,
      marginLeft: -10,
      marginRight: -10,
      paddingHorizontal: 17,
      color: colorScheme === "light" ? "black" : "white",
    },
    gap: {
      width: 20,
    },
    text: {
      fontSize: 17,
    },
    buttonContainer: {
      alignItems: "center",
    },
    buttonText: {
      padding: 10,
      fontSize: 18,
      fontWeight: "bold",
      color: "#19bfb7",
    },
    errorText: {
      marginTop: 5,
      marginLeft: 5,
      fontSize: 12,
      color: "red",
    },
  });
};
