import { useColorScheme, StyleSheet, Dimensions } from "react-native";
import { View, Text } from "../components/Theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function RemoveMessage() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    
    return (
        <View style={styles.container}>
            <Text style={{color: colorScheme === "light" ? "black" : "white",}}>Removed from Library  </Text>
            <MaterialIcons name="done" size={20} color={colorScheme === "light" ? "black" : "white"} />
        </View>
    );
}

const getStyles = (colorScheme: string | null | undefined) => {
    return StyleSheet.create({
      container: {
        position: "absolute",
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: colorScheme === "light" ? "#f5f5f5" : "#202123",
        width: Dimensions.get("window").width,
        height: 45,
      },
    });
}