import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Text, View } from "../components/Theme";
import { useAuth } from "../AuthContext";

export default function SignUp() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [textEmail, setTextEmail] = useState("");
  const [textUsername, setTextUsername] = useState("");
  const [textPassword, setTextPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { onSignUp } = useAuth();

  const handleSignUp = async () => {
    const response = await onSignUp!(textEmail, textUsername, textPassword);

    if (response.statusCode === 400 || response.statusCode === 403) {
      const errorResponse = await response.message;
      if (errorResponse) {
        if (response.statusCode === 403) {
          setEmailError(errorResponse);
        } else {
          let emailFlag = 1;
          let passwordFlag = 1;
          for (let i = 0; i < errorResponse.length; i++) {
            if (
              (errorResponse[i].includes("Email") ||
                errorResponse[i].includes("email")) &&
              emailFlag
            ) {
              setEmailError(errorResponse[i]);
              emailFlag = 0;
            }
            if (
              (errorResponse[i].includes("Password") ||
                errorResponse[i].includes("password")) &&
              passwordFlag
            ) {
              setPasswordError(errorResponse[i]);
              passwordFlag = 0;
            }
          }
        }
      } else {
        throw new Error("Error signing up");
      }
    } else {
      navigation.navigate("TabGroup");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.text}> Email* </Text>
        <View style={styles.gap} />
        <TextInput
          style={styles.textInput}
          placeholder="example@gmail.com"
          placeholderTextColor="gray"
          onChangeText={(newText) => {
            setTextEmail(newText);
            setEmailError("");
          }}
          defaultValue={textEmail}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        <View style={styles.space} />
        <Text style={styles.text}> Username </Text>
        <View style={styles.gap} />
        <TextInput
          style={styles.textInput}
          placeholder="user"
          placeholderTextColor="gray"
          onChangeText={(newText) => setTextUsername(newText)}
          defaultValue={textUsername}
        />
        <View style={styles.space} />
        <Text style={styles.text}> Password* </Text>
        <View style={styles.gap} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={(newText) => {
            setTextPassword(newText);
            setPasswordError("");
          }}
          defaultValue={textPassword}
        />
        {passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}
        <View style={styles.space} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
