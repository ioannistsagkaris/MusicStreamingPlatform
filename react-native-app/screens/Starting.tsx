import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Theme";
import { useEffect } from "react";
import { useSong } from "../SongContext";

export default function Starting() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const { onStop } = useSong();

  useEffect(() => {
    const stop = async () => {
      await onStop!();
    };
    stop();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.imagePadding}>
          <Image
            source={require("../assets/logo/logo.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.imagePosition}>
          <Text style={styles.imageText}>Audio Alcove</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate("Sign Up")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate("Sign In")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colorScheme: string | null | undefined) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    buttons: {
      flexDirection: "row",
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    padding: {
      paddingBottom: 250,
      paddingTop: 50,
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    space: {
      width: 50,
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    image: {
      width: 375,
      height: 230,
      resizeMode: "contain",
    },
    imagePadding: {
      paddingRight: 5,
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    imagePosition: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
    },
    imageText: {
      fontSize: 22,
      fontWeight: "300",
    },
    button: {
      borderWidth: 1,
      borderColor: "#19bfb7",
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 15,
      backgroundColor: "#19bfb7",
    },
    buttonText: {
      fontSize: 16,
      color: "white",
    },
  });
};
