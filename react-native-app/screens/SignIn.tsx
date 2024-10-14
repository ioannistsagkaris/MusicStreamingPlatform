import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { Text, View } from "../components/Theme";
import { useAuth } from "../AuthContext";

export default function SignIn() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [textEmail, setTextEmail] = useState("");
  const [textPassword, setTextPassword] = useState("");
  const [error, setError] = useState("");
  const { onSignIn } = useAuth();

  const handleSignIn = async () => {
    const response = await onSignIn!(textEmail, textPassword);

    if (response.statusCode === 400) {
      const errorResponse = await response.message;
      if (errorResponse) {
        setError(errorResponse);
      } else {
        throw new Error("Error signing in");
      }
    } else {
      navigation.navigate("TabGroup");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.text}> Email </Text>
        <View style={styles.gap} />
        <TextInput
          style={styles.textInput}
          placeholder="example@gmail.com"
          placeholderTextColor="gray"
          onChangeText={(newText) => {
            setTextEmail(newText);
            setError("");
          }}
          defaultValue={textEmail}
        />
        <View style={styles.space} />
        <Text style={styles.text}> Password </Text>
        <View style={styles.gap} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={(newText) => {
            setTextPassword(newText);
            setError("");
          }}
          defaultValue={textPassword}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.space} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Sign In</Text>
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
      height: 112,
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
