import { useColorScheme, StyleSheet, Dimensions } from "react-native";
import { View, Text } from "../components/Theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function AddPlayerMessage() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    
    return (
        <View style={styles.container}>
            <Text style={{color: "white",}}>Added to Library  </Text>
            <MaterialIcons name="done" size={20} color="white" />
        </View>
    );
}

const getStyles = (colorScheme: string | null | undefined) => {
    return StyleSheet.create({
      container: {
        position: "absolute",
        top: Dimensions.get("window").width - 325,
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "transparent",
        width: Dimensions.get("window").width,
        height: 45,
      },
    });
}